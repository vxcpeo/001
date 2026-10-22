<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createWallet, describeError } from './solana.js'

/* ---------------------------------------------------------------------------
   Callova - live prediction arena.
   Tidal Sui / Gallery Scroll skin: a white tidal ground, full-viewport scenes,
   a snap-scrolling line rail and a floating dock. Presentation lives in
   src/styles/tidal.css.
   --------------------------------------------------------------------------- */

const wallet = createWallet({
  cluster: import.meta.env.VITE_SOLANA_CLUSTER || 'testnet',
  rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || '',
  programId: import.meta.env.VITE_SOLANA_PROGRAM_ID || '',
})

const walletState = ref({ ...wallet.state })
const walletCatalog = ref(wallet.catalog())
const walletOpen = ref(false)
const walletBusy = ref(false)
const walletError = ref('')
const walletNotice = ref('')
const installUrl = ref('')

const connected = computed(() => walletState.value.phase === 'connected' && Boolean(walletState.value.address))
const connecting = computed(() => walletState.value.phase === 'connecting')
const address = computed(() => walletState.value.address)
const shortAddress = computed(() => (address.value ? `${address.value.slice(0, 4)}\u2026${address.value.slice(-4)}` : ''))
const balanceText = computed(() => {
  if (!connected.value) return '---'
  if (walletState.value.balanceError) return 'unavailable'
  return wallet.solFromLamports(walletState.value.balance)
})
const clusterLabel = computed(() => (wallet.cluster === 'mainnet-beta' ? 'mainnet' : wallet.cluster))
const explorerUrl = computed(() =>
  address.value ? `https://explorer.solana.com/address/${address.value}?cluster=${wallet.cluster}` : 'https://explorer.solana.com',
)

let unsubscribe = () => {}

/* ---------------------------------------------------------------- markets -- */

const markets = [
  { id: 1, code: 'LN-01', lane: 'Crypto', question: 'BTC closes the month above $100k', yes: 68, move: 8.2, volume: 482910, closes: 'Jul 01', hours: 72, traders: 1284, spark: [42, 48, 45, 55, 61, 58, 64, 68] },
  { id: 2, code: 'LN-02', lane: 'Culture', question: 'The next flagship title ships this summer', yes: 43, move: -2.4, volume: 139420, closes: 'Aug 31', hours: 1536, traders: 612, spark: [55, 52, 49, 51, 46, 44, 45, 43] },
  { id: 3, code: 'LN-03', lane: 'Crypto', question: 'SOL out-earns BTC on daily fees', yes: 21, move: 4.7, volume: 98260, closes: 'Jun 30', hours: 48, traders: 904, spark: [12, 14, 13, 16, 18, 17, 19, 21] },
  { id: 4, code: 'LN-04', lane: 'Sports', question: 'The home side lifts the trophy', yes: 57, move: 1.3, volume: 311850, closes: 'Jun 18', hours: 264, traders: 2210, spark: [50, 52, 51, 54, 53, 56, 55, 57] },
  { id: 5, code: 'LN-05', lane: 'Culture', question: 'A pixel classic gets a full remake', yes: 76, move: 10.1, volume: 76103, closes: 'Sep 12', hours: 1824, traders: 388, spark: [58, 61, 64, 63, 69, 72, 74, 76] },
  { id: 6, code: 'LN-06', lane: 'Crypto', question: 'Solana daily active addresses pass 5M', yes: 34, move: -0.8, volume: 205600, closes: 'Dec 31', hours: 4464, traders: 741, spark: [40, 38, 39, 36, 35, 34, 35, 34] },
  { id: 7, code: 'LN-07', lane: 'Tech', question: 'An open model tops the coding leaderboard', yes: 62, move: 5.6, volume: 154980, closes: 'Aug 09', hours: 960, traders: 533, spark: [44, 47, 50, 52, 55, 58, 60, 62] },
  { id: 8, code: 'LN-08', lane: 'Tech', question: 'Consumer headsets outsell last year', yes: 29, move: -3.1, volume: 64210, closes: 'Nov 04', hours: 3144, traders: 244, spark: [38, 36, 35, 33, 32, 30, 30, 29] },
]

const lanes = ['All lanes', 'Trending', 'Crypto', 'Tech', 'Culture', 'Sports']
const sorts = [
  { id: 'heat', label: 'Heat' },
  { id: 'yes', label: 'Odds' },
  { id: 'closing', label: 'Closing' },
]

const lane = ref('All lanes')
const sort = ref('heat')
const query = ref('')
const tradeOpen = ref(false)
const active = ref(null)
const side = ref('YES')
const stake = ref('0.10')
const submitting = ref(false)
const tradeError = ref('')
const receipts = ref(loadReceipts())
const toast = ref('')
let toastTimer = 0

function loadReceipts() {
  try {
    const raw = localStorage.getItem('callova.receipts.v1')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveReceipt(receipt) {
  receipts.value = [receipt, ...receipts.value].slice(0, 40)
  try {
    localStorage.setItem('callova.receipts.v1', JSON.stringify(receipts.value))
  } catch {
    /* storage is optional; the on-chain signature is the real record */
  }
}

const laneTabs = computed(() =>
  lanes.map((name) => ({
    name,
    count: name === 'All lanes'
      ? markets.length
      : name === 'Trending'
        ? markets.filter((market) => Math.abs(market.move) >= 4).length
        : markets.filter((market) => market.lane === name).length,
  })),
)

const visibleMarkets = computed(() => {
  const needle = query.value.trim().toLowerCase()
  const rows = markets.filter((market) => {
    const inLane = lane.value === 'All lanes'
      || (lane.value === 'Trending' ? Math.abs(market.move) >= 4 : market.lane === lane.value)
    const inQuery = !needle || `${market.question} ${market.code} ${market.closes}`.toLowerCase().includes(needle)
    return inLane && inQuery
  })
  return [...rows].sort((a, b) => {
    if (sort.value === 'yes') return b.yes - a.yes
    if (sort.value === 'closing') return a.hours - b.hours
    return b.volume * Math.abs(b.move) - a.volume * Math.abs(a.move)
  })
})

const wireItems = computed(() =>
  markets.map((market) => ({
    code: market.code,
    label: market.question,
    yes: market.yes,
    move: market.move,
  })),
)

const arenaStats = computed(() => {
  const volume = markets.reduce((sum, market) => sum + market.volume, 0)
  const traders = markets.reduce((sum, market) => sum + market.traders, 0)
  return [
    { label: 'Lines open', value: String(markets.length).padStart(2, '0') },
    { label: 'Volume 24h', value: `$${(volume / 1_000_000).toFixed(2)}M` },
    { label: 'Traders', value: traders.toLocaleString('en-US') },
    { label: 'Take rate', value: '0.20%' },
  ]
})

function sparkPath(values) {
  const width = 96
  const height = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / span) * height
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function closesIn(hours) {
  if (hours < 48) return `${hours}h left`
  return `${Math.round(hours / 24)}d left`
}

function receiptFor(id) {
  return receipts.value.find((receipt) => receipt.marketId === id) || null
}

/* ----------------------------------------------------------------- wallet -- */

function flash(message, duration = 3600) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, duration)
}

async function connect(id) {
  walletBusy.value = true
  walletError.value = ''
  installUrl.value = ''
  try {
    const account = await wallet.connect(id)
    walletOpen.value = false
    walletNotice.value = ''
    flash(`Wallet attached \u00b7 ${account.slice(0, 4)}\u2026${account.slice(-4)}`)
  } catch (error) {
    walletError.value = error?.install ? `${describeError(error)} Install it, then reload this page.` : describeError(error)
    installUrl.value = error?.install || ''
  } finally {
    walletBusy.value = false
    walletCatalog.value = wallet.catalog()
  }
}

async function dropWallet() {
  await wallet.disconnect()
  flash('Wallet detached.')
}

function openWallet() {
  walletError.value = ''
  walletNotice.value = ''
  installUrl.value = ''
  walletCatalog.value = wallet.catalog()
  walletOpen.value = true
}

/* ------------------------------------------------------------------ trade -- */

const yesPrice = computed(() => active.value?.yes ?? 50)
const sidePrice = computed(() => (side.value === 'YES' ? yesPrice.value : 100 - yesPrice.value))
const stakeNumber = computed(() => {
  const value = Number.parseFloat(String(stake.value))
  return Number.isFinite(value) && value > 0 ? value : 0
})
const payout = computed(() => {
  const probability = Math.max(sidePrice.value, 1)
  return (stakeNumber.value / probability) * 100
})
const netGain = computed(() => payout.value - stakeNumber.value)
const stakeTooLarge = computed(() => {
  const balance = walletState.value.balance
  if (!connected.value || balance === null) return false
  return stakeNumber.value + 0.00001 > Number(wallet.solFromLamports(balance))
})
const canSubmit = computed(() => Boolean(active.value) && stakeNumber.value > 0 && !submitting.value)

function openTrade(market, nextSide = 'YES') {
  active.value = market
  side.value = nextSide
  tradeError.value = ''
  stake.value = market.id % 2 ? '0.10' : '0.25'
  tradeOpen.value = true
  if (connected.value) wallet.refreshBalance()
}

function closeTrade() {
  tradeOpen.value = false
  active.value = null
  tradeError.value = ''
}

async function submitTrade() {
  if (!connected.value) {
    closeTrade()
    walletNotice.value = 'Attach a wallet first - your position is signed by your own key, not by this page.'
    openWallet()
    return
  }
  if (!canSubmit.value) return
  submitting.value = true
  tradeError.value = ''
  const market = active.value
  try {
    const note = `Callova|${market.code}|${side.value}|${stakeNumber.value.toFixed(3)}SOL|${new Date().toISOString()}`
    const result = await wallet.signMemo(note)
    saveReceipt({
      marketId: market.id,
      code: market.code,
      question: market.question,
      side: side.value,
      stake: stakeNumber.value.toFixed(3),
      signature: result.signature,
      cluster: wallet.cluster,
      at: new Date().toISOString(),
    })
    closeTrade()
    flash(`Signed on ${clusterLabel.value} \u00b7 ${result.signature.slice(0, 10)}\u2026`)
    wallet.refreshBalance()
  } catch (error) {
    tradeError.value = describeError(error)
  } finally {
    submitting.value = false
  }
}

watch(
  () => walletOpen.value || tradeOpen.value,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

function onKey(event) {
  if (event.key !== 'Escape') return
  if (tradeOpen.value) closeTrade()
  else if (walletOpen.value) walletOpen.value = false
}

let refreshTimer = 0

onMounted(async () => {
  unsubscribe = wallet.subscribe((next) => {
    walletState.value = next
  })
  window.addEventListener('keydown', onKey)
  walletCatalog.value = wallet.catalog()
  const resumed = await wallet.resume()
  if (resumed) flash(`Wallet re-attached \u00b7 ${shortAddress.value}`)
  refreshTimer = window.setInterval(() => {
    if (connected.value) wallet.refreshBalance()
  }, 45000)
})

onBeforeUnmount(() => {
  unsubscribe()
  window.removeEventListener('keydown', onKey)
  window.clearInterval(refreshTimer)
  window.clearTimeout(toastTimer)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <div class="td-page">
    <div class="td-wash" aria-hidden="true">
      <svg class="td-tide" viewBox="0 0 1440 640" aria-hidden="true" focusable="false">
        <path d="M0 300C180 210 320 400 520 330S880 160 1120 280 1360 360 1440 300" />
        <path d="M0 380C200 300 340 470 560 400S920 240 1160 350 1380 430 1440 380" />
        <path d="M0 460C220 380 360 540 600 470S960 320 1200 420 1400 500 1440 460" />
      </svg>
    </div>

    <header class="td-opening">
      <div class="td-opening-bar">
        <a class="td-mark" href="#feed" aria-label="Callova home">
          <span class="td-mark-glyph" aria-hidden="true">
            <svg viewBox="0 0 64 64" focusable="false">
              <path d="M32 7.5 56.5 32H7.5Z" fill="currentColor" />
              <path d="M8.9 34.6h46.2L32 57.1Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" />
              <rect x="28.9" y="28.9" width="6.2" height="6.2" rx="1" fill="#298dff" />
            </svg>
          </span>
          <span class="td-mark-word">CALL<em>OVA</em></span>
        </a>
        <p class="td-imprint">Prediction arena &middot; Solana</p>
      </div>

      <div class="td-opening-body">
        <h1 class="td-claim">
          <span>PRICE THE</span>
          <span>FUTURE.</span>
          <span class="td-claim-accent">SIGN THE CALL.</span>
        </h1>

        <div class="td-aside-block">
          <p class="td-standfirst">
            Every question here runs as a live line. The crowd sets the number, you take a side, and the
            wallet in your pocket signs it &mdash; the extension you already run, on the cluster the
            readout names, with nothing standing in for your key.
            Callova reads the chain you are actually on and pays out on the terms it publishes.
          </p>

          <div class="td-opening-actions">
            <label class="td-search">
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.4" />
                <path d="M10.6 10.6 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" />
              </svg>
              <input v-model="query" type="search" placeholder="Search lines" aria-label="Search lines" />
            </label>
            <a class="td-primary" href="#feed">Open the feed</a>
            <button class="td-quiet" type="button" @click="connected ? openWallet() : openWallet()">
              {{ connected ? 'Your desk' : 'Attach a wallet' }}
            </button>
          </div>
        </div>
      </div>

      <div class="td-cue" aria-hidden="true">
        <span class="td-cue-tick"></span>
        <span class="td-cue-line"></span>
      </div>
    </header>

    <main class="td-gallery" role="main">
      <section id="feed" class="td-scene td-feed" aria-labelledby="td-feed-title">
        <div class="td-scene-head">
          <div>
            <p class="td-kicker">the feed</p>
            <h2 id="td-feed-title" class="td-display">OPEN LINES</h2>
          </div>
          <p class="td-tally">{{ visibleMarkets.length }} of {{ markets.length }} lines shown</p>
        </div>

        <div class="td-tape" role="region" aria-label="Latest lines" tabindex="0">
          <div class="td-tape-rail">
            <span v-for="(item, index) in [...wireItems, ...wireItems]" :key="`${item.code}-${index}`" class="td-tape-item">
              <b>{{ item.code }}</b>
              <span class="td-tape-label">{{ item.label }}</span>
              <strong :class="item.move < 0 ? 'td-loss' : 'td-gain'">{{ item.yes }}%</strong>
              <em :class="item.move < 0 ? 'td-loss' : 'td-gain'">{{ item.move > 0 ? '+' : '' }}{{ item.move.toFixed(1) }}</em>
            </span>
          </div>
        </div>

        <div class="td-filters">
          <div class="td-lanes" role="tablist" aria-label="Lanes">
            <button
              v-for="tab in laneTabs"
              :key="tab.name"
              type="button"
              role="tab"
              class="td-lane"
              :aria-selected="lane === tab.name"
              :class="{ 'td-is-on': lane === tab.name }"
              @click="lane = tab.name"
            >
              {{ tab.name }}<b>{{ tab.count }}</b>
            </button>
          </div>

          <div class="td-sorts" role="group" aria-label="Sort lines">
            <button
              v-for="option in sorts"
              :key="option.id"
              type="button"
              class="td-sort"
              :class="{ 'td-is-on': sort === option.id }"
              @click="sort = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="td-rail-wrap">
          <ol class="td-rail">
          <li v-for="market in visibleMarkets" :key="market.id" class="td-line">
            <div class="td-line-top">
              <span class="td-code">{{ market.code }}</span>
              <span class="td-lane-tag">{{ market.lane }}</span>
              <span class="td-clock">{{ closesIn(market.hours) }}</span>
            </div>

            <h3 class="td-question">{{ market.question }}</h3>

            <div class="td-line-figure">
              <strong class="td-quote">{{ market.yes }}<i>%</i></strong>
              <span class="td-spark">
                <svg viewBox="0 0 96 28" preserveAspectRatio="none" aria-hidden="true">
                  <path :d="sparkPath(market.spark)" :class="market.move < 0 ? 'td-loss' : 'td-gain'" />
                </svg>
              </span>
            </div>

            <p class="td-split">yes <b>{{ market.yes }}</b> / no <b>{{ 100 - market.yes }}</b></p>

            <p class="td-line-meta">
              <em :class="market.move < 0 ? 'td-loss' : 'td-gain'">{{ market.move > 0 ? '+' : '' }}{{ market.move.toFixed(1) }}%</em>
              <span class="td-volume">${{ (market.volume / 1000).toFixed(0) }}k</span>
              <span class="td-heat">{{ market.traders }} in</span>
            </p>

            <div class="td-sides">
              <button class="td-take td-take--yes" type="button" @click="openTrade(market, 'YES')">
                yes<b>{{ market.yes }}%</b>
              </button>
              <button class="td-take td-take--no" type="button" @click="openTrade(market, 'NO')">
                no<b>{{ 100 - market.yes }}%</b>
              </button>
            </div>

            <p v-if="receiptFor(market.id)" class="td-slip">
              you signed {{ receiptFor(market.id).side }} &middot; {{ receiptFor(market.id).stake }} SOL
            </p>
          </li>
          </ol>
        </div>

        <p v-if="!visibleMarkets.length" class="td-empty">
          No line matches that. Clear the search or switch lanes.
        </p>
      </section>

      <section id="desk" class="td-scene td-readout" aria-label="Arena readout">
        <div class="td-readout-main">
          <div class="td-readout-head">
            <p class="td-kicker">arena readout</p>
            <span class="td-stream"><i aria-hidden="true"></i>streaming</span>
          </div>

          <dl class="td-stats">
            <div v-for="stat in arenaStats" :key="stat.label" class="td-stat">
              <dt>{{ stat.label }}</dt>
              <dd>{{ stat.value }}</dd>
            </div>
          </dl>

          <div class="td-pulse" aria-hidden="true">
            <span v-for="bar in 22" :key="bar" :style="{ height: `${14 + ((bar * 41) % 82)}%` }"></span>
          </div>

          <div class="td-seal-row">
            <span class="td-seal">CALLOVA-01</span>
            <button v-if="connected" class="td-chip" type="button" @click="openWallet">
              <span class="td-chip-dot" aria-hidden="true"></span>
              {{ shortAddress }}
              <b>{{ balanceText }} SOL</b>
            </button>
            <button v-else class="td-chip" type="button" @click="openWallet">
              <span class="td-chip-dot" aria-hidden="true"></span>
              <span>Attach wallet</span>
            </button>
            <span class="td-wallet-state">{{ connected ? `wallet ${shortAddress}` : 'wallet detached' }}</span>
          </div>

          <dl class="td-facts">
            <div><dt>Network</dt><dd>Solana {{ clusterLabel }}</dd></div>
            <div><dt>Latest blockhash</dt><dd>{{ walletState.balanceAt ? 'streaming' : 'on demand' }}</dd></div>
            <div><dt>Wallet</dt><dd>{{ connected ? walletState.providerName : 'not attached' }}</dd></div>
          </dl>
        </div>

        <div class="td-desk-card">
          <div class="td-desk-head">
            <span class="td-desk-glyph" aria-hidden="true">
              <svg viewBox="0 0 64 64" focusable="false">
                <path d="M32 7.5 56.5 32H7.5Z" fill="currentColor" />
                <path d="M8.9 34.6h46.2L32 57.1Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" />
              </svg>
            </span>
            <div>
              <p class="td-kicker">your desk</p>
              <h2 id="td-desk-title" class="td-display">{{ connected ? 'WALLET ONLINE' : 'WALLET DETACHED' }}</h2>
            </div>
          </div>

          <div class="td-nodes">
            <div class="td-node">
              <span>Address</span>
              <strong>{{ connected ? shortAddress : '---' }}</strong>
            </div>
            <div class="td-node">
              <span>Balance on {{ clusterLabel }}</span>
              <strong>{{ balanceText }} <i v-if="connected && !walletState.balanceError">SOL</i></strong>
            </div>
            <div class="td-node">
              <span>Signed positions</span>
              <strong>{{ String(receipts.length).padStart(2, '0') }}</strong>
            </div>
          </div>

          <div class="td-desk-actions">
            <a v-if="connected" class="td-act" :href="explorerUrl" target="_blank" rel="noreferrer">View on explorer</a>
            <button v-if="connected" class="td-act" type="button" @click="wallet.refreshBalance(); flash('Balance refreshed from ' + clusterLabel + '.')">
              Refresh balance
            </button>
            <button v-if="connected" class="td-act" type="button" @click="dropWallet">Detach wallet</button>
            <button v-else class="td-act td-act--primary" type="button" @click="openWallet">Attach wallet</button>
          </div>

          <ul v-if="receipts.length" class="td-slips">
            <li v-for="receipt in receipts.slice(0, 4)" :key="receipt.signature">
              <span class="td-slip-side" :class="receipt.side === 'YES' ? 'td-gain' : 'td-loss'">{{ receipt.side }}</span>
              <span class="td-slip-q">{{ receipt.question }}</span>
              <span class="td-slip-sig">{{ receipt.stake }} SOL &middot; {{ receipt.signature.slice(0, 8) }}&hellip;</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="rules" class="td-scene td-rules" aria-labelledby="td-rules-title">
        <p class="td-kicker">three moves</p>
        <h2 id="td-rules-title" class="td-display">HOW A POSITION GETS MADE</h2>

        <ol class="td-moves">
          <li class="td-move">
            <b class="td-move-no">01</b>
            <div class="td-move-body">
              <h3>Read the line</h3>
              <p>The percentage on every card is the crowd's current read, refreshed as positions come in. It is a price, never a promise.</p>
            </div>
          </li>
          <li class="td-move">
            <b class="td-move-no">02</b>
            <div class="td-move-body">
              <h3>Pick a side</h3>
              <p>Back YES or NO. Both sides fund the same pool and settle on the same published rules, with no house seat at the table.</p>
            </div>
          </li>
          <li class="td-move">
            <b class="td-move-no">03</b>
            <div class="td-move-body">
              <h3>Sign it yourself</h3>
              <p>Your wallet builds and signs the transaction. Callova never holds your key, and the signature is the receipt the chain keeps.</p>
            </div>
          </li>
        </ol>

        <p class="td-note">
          The market program is not deployed yet, so a signed position is recorded as an on-chain
          transaction rather than held in a settlement pool. When the program lands on this cluster,
          the same button routes the position into it and the pool settles on the published rules.
        </p>
      </section>
    </main>

    <footer class="td-outro" role="contentinfo">
      <div class="td-outro-inner">
        <div class="td-outro-top">
          <span class="td-outro-brand">Callova <em>/ 2026</em></span>
          <span class="td-outro-tag">Price the future. Sign the call.</span>
          <nav class="td-outro-net" aria-label="Network">
            Solana {{ clusterLabel }} &middot;
            <a :href="`https://explorer.solana.com/?cluster=${wallet.cluster}`" target="_blank" rel="noreferrer">explorer</a>
          </nav>
        </div>
        <div class="td-outro-bottom">
          <p class="td-outro-live">
            <span class="td-live"><i aria-hidden="true"></i>LIVE</span>
            <span class="td-dim">{{ wallet.programId ? 'market program wired' : 'every position signed on-chain' }}</span>
          </p>
          <p class="td-outro-meta">
            <span class="td-dim">cluster</span>
            <strong>{{ clusterLabel }}</strong>
            <span class="td-sep">/</span>
            <span class="td-dim">settlement</span>
            <strong>your key</strong>
          </p>
        </div>
      </div>
    </footer>

    <nav class="td-dock" aria-label="Primary">
      <a class="td-dock-link" href="#feed">
        <span class="td-dock-dot" aria-hidden="true"></span><span>Feed</span>
      </a>
      <a class="td-dock-link" href="#rules">
        <span class="td-dock-dot" aria-hidden="true"></span><span>Rules</span>
      </a>
      <a class="td-dock-link" href="#desk">
        <span class="td-dock-dot" aria-hidden="true"></span><span>Desk</span>
      </a>
    </nav>

    <div v-if="tradeOpen && active" class="td-veil" @click.self="closeTrade">
      <section class="td-sheet" role="dialog" aria-modal="true" aria-labelledby="td-trade-title">
        <button class="td-sheet-x" type="button" aria-label="Close" @click="closeTrade">&#215;</button>
        <p class="td-kicker">{{ active.code }} &middot; {{ active.lane }} &middot; {{ closesIn(active.hours) }}</p>
        <h2 id="td-trade-title" class="td-sheet-title">{{ active.question }}</h2>
        <p class="td-sheet-sub">Closes {{ active.closes }} &middot; settled on Solana {{ clusterLabel }}</p>

        <div class="td-plate-sides" role="group" aria-label="Pick a side">
          <button type="button" class="td-plate-side" :class="{ 'td-on': side === 'YES' }" @click="side = 'YES'">
            <span>YES</span><b>{{ active.yes }}%</b>
          </button>
          <button type="button" class="td-plate-side" :class="{ 'td-on': side === 'NO' }" @click="side = 'NO'">
            <span>NO</span><b>{{ 100 - active.yes }}%</b>
          </button>
        </div>

        <label class="td-stake">
          <span>Stake</span>
          <input v-model="stake" type="number" min="0.01" step="0.01" inputmode="decimal" aria-label="Stake in SOL" />
          <b>SOL</b>
        </label>
        <p v-if="connected" class="td-hint">
          Wallet holds {{ balanceText }} SOL<span v-if="stakeTooLarge" class="td-warn"> - the stake plus the fee is above that.</span>
        </p>
        <p v-else class="td-hint">Attach a wallet to price this against your real balance.</p>

        <dl class="td-quote-table">
          <div><dt>Side price</dt><dd>{{ sidePrice }}%</dd></div>
          <div><dt>Payout if right</dt><dd class="td-strong">{{ payout.toFixed(2) }} SOL</dd></div>
          <div><dt>Net gain</dt><dd>{{ netGain >= 0 ? '+' : '' }}{{ netGain.toFixed(2) }} SOL</dd></div>
          <div><dt>Signed by</dt><dd>{{ connected ? shortAddress : 'no wallet' }}</dd></div>
        </dl>

        <p v-if="tradeError" class="td-error">{{ tradeError }}</p>

        <button class="td-act td-act--primary td-act--wide" type="button" :disabled="submitting" @click="submitTrade">
          <template v-if="!connected">Attach wallet to continue</template>
          <template v-else-if="submitting">Waiting for your wallet&hellip;</template>
          <template v-else>Sign {{ side }} position &middot; {{ stakeNumber.toFixed(2) }} SOL</template>
        </button>
        <p class="td-note-small">
          Your wallet signs a real transaction carrying this position note, so the call is on the public
          record the moment it lands. Nothing moves without your approval.
        </p>
      </section>
    </div>

    <div v-if="walletOpen" class="td-veil" @click.self="walletOpen = false">
      <section class="td-sheet" role="dialog" aria-modal="true" aria-labelledby="td-wallet-title">
        <button class="td-sheet-x" type="button" aria-label="Close" @click="walletOpen = false">&#215;</button>
        <span class="td-sheet-glyph" aria-hidden="true">
          <svg viewBox="0 0 64 64" focusable="false">
            <path d="M32 7.5 56.5 32H7.5Z" fill="currentColor" />
            <path d="M8.9 34.6h46.2L32 57.1Z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" />
          </svg>
        </span>
        <p class="td-kicker">{{ clusterLabel }} &middot; real wallet</p>
        <h2 id="td-wallet-title" class="td-sheet-title">{{ connected ? 'YOUR DESK' : 'ATTACH YOUR WALLET' }}</h2>

        <template v-if="connected">
          <dl class="td-quote-table td-quote-table--left">
            <div><dt>Account</dt><dd>{{ shortAddress }}</dd></div>
            <div><dt>Wallet</dt><dd>{{ walletState.providerName }}</dd></div>
            <div><dt>Balance</dt><dd class="td-strong">{{ balanceText }} SOL</dd></div>
          </dl>
          <p v-if="walletState.balanceError" class="td-error">{{ walletState.balanceError }}</p>
          <div class="td-wallet-row">
            <button class="td-act" type="button" @click="wallet.refreshBalance()">Refresh</button>
            <a class="td-act" :href="explorerUrl" target="_blank" rel="noreferrer">Explorer</a>
            <button class="td-act" type="button" @click="dropWallet(); walletOpen = false">Detach</button>
          </div>
        </template>

        <template v-else>
          <p class="td-sheet-sub">
            Callova connects through the wallet extension you already run, on Solana {{ clusterLabel }}.
            Your key stays in the extension; this page only asks it to sign what you approve.
          </p>
          <p v-if="walletNotice" class="td-note-small">{{ walletNotice }}</p>
          <ul class="td-wallet-list">
            <li v-for="option in walletCatalog" :key="option.id">
              <button class="td-wallet-pick" type="button" :disabled="walletBusy || connecting" @click="connect(option.id)">
                <span class="td-wallet-name">{{ option.name }}</span>
                <span class="td-wallet-flag" :class="{ 'td-on': option.available }">
                  {{ option.available ? 'detected' : 'not installed' }}
                </span>
              </button>
            </li>
          </ul>
          <p v-if="walletError" class="td-error">{{ walletError }}</p>
          <a v-if="installUrl" class="td-act td-act--wide" :href="installUrl" target="_blank" rel="noreferrer">
            Get the wallet, then reload
          </a>
          <p class="td-note-small">
            No wallet listed? Install Phantom, Solflare, Backpack, Glow or Brave Wallet and reload this page.
            Nothing is simulated here, so a wallet really has to be present.
          </p>
        </template>
      </section>
    </div>

    <transition name="pop">
      <p v-if="toast" class="td-toast" role="status" aria-live="polite">{{ toast }}</p>
    </transition>
  </div>
</template>
