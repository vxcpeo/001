<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createWallet, describeError } from './solana.js'

/* ---------------------------------------------------------------------------
   Signaris - live prediction arena.
   Paper Protocol skin: paper ground, ether-blue rules, serif display voice, mono gutters.
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
    const raw = localStorage.getItem('signaris.receipts.v1')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveReceipt(receipt) {
  receipts.value = [receipt, ...receipts.value].slice(0, 40)
  try {
    localStorage.setItem('signaris.receipts.v1', JSON.stringify(receipts.value))
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
    const note = `Signaris|${market.code}|${side.value}|${stakeNumber.value.toFixed(3)}SOL|${new Date().toISOString()}`
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
  <div class="ledger-page">
    <header class="ledger-masthead">
      <div class="ledger-masthead-row">
        <a class="ledger-brand" href="#feed" aria-label="Signaris home">
          <span class="ledger-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" focusable="false">
              <rect width="64" height="64" rx="32" fill="currentColor" />
              <path d="M13 46 L26 46 L38 18 L51 18" fill="none" stroke="var(--pp-paper)" stroke-width="5" stroke-linecap="square" />
              <rect x="22" y="9" width="20" height="3" fill="var(--pp-accent-2)" />
            </svg>
          </span>
          <span class="ledger-brand-word">SIGN<em>ARIS</em></span>
        </a>
        <p class="ledger-imprint">Prediction arena &middot; Solana</p>
      </div>
      <nav class="ledger-index" aria-label="Primary">
        <a href="#feed">Feed</a>
        <a href="#rules">Rules</a>
        <a href="#desk">Desk</a>
      </nav>
    </header>

    <section class="ledger-wire" aria-label="Latest lines">
      <div class="ledger-wire-track">
        <span v-for="(item, index) in [...wireItems, ...wireItems]" :key="`${item.code}-${index}`" class="ledger-wire-item">
          <b>{{ item.code }}</b>
          <span class="ledger-wire-label">{{ item.label }}</span>
          <strong :class="item.move < 0 ? 'ledger-down' : 'ledger-up'">{{ item.yes }}%</strong>
          <em :class="item.move < 0 ? 'ledger-down' : 'ledger-up'">{{ item.move > 0 ? '+' : '' }}{{ item.move.toFixed(1) }}</em>
        </span>
      </div>
    </section>

    <main class="ledger-main">
      <section class="ledger-opening">
        <h1 class="ledger-claim">
          <span>PRICE THE</span>
          <span>FUTURE.</span>
          <span>SIGN THE CALL.</span>
        </h1>
        <div class="ledger-opening-actions">
          <a class="ledger-action ledger-action--fill" href="#feed">Open the feed</a>
          <button class="ledger-action" type="button" @click="connected ? openWallet() : openWallet()">
            {{ connected ? 'Your desk' : 'Attach a wallet' }}
          </button>
        </div>
      </section>

      <div class="ledger-columns">
        <div class="ledger-column-main">
          <p class="ledger-lede">
            Every question here runs as a live line. The crowd sets the number, you take a side, and the
            wallet in your pocket signs it &mdash; the extension you already run, on the cluster the
            readout names, with nothing standing in for your key.
            Signaris reads the chain you are actually on and pays out on the terms it publishes.
          </p>

          <section id="feed" class="ledger-feed">
            <div class="ledger-section-head">
              <p class="ledger-kicker">the feed</p>
              <h2 class="ledger-headline">OPEN LINES</h2>
              <p class="ledger-tally">{{ visibleMarkets.length }} of {{ markets.length }} lines shown</p>
            </div>

            <div class="ledger-lanes" role="tablist" aria-label="Lanes">
              <button
                v-for="tab in laneTabs"
                :key="tab.name"
                type="button"
                role="tab"
                class="ledger-lane"
                :aria-selected="lane === tab.name"
                :class="{ 'ledger-on': lane === tab.name }"
                @click="lane = tab.name"
              >
                {{ tab.name }}<b>{{ tab.count }}</b>
              </button>
            </div>

            <div class="ledger-tools">
              <div class="ledger-sorts" role="group" aria-label="Sort lines">
                <button
                  v-for="option in sorts"
                  :key="option.id"
                  type="button"
                  :class="{ 'ledger-on': sort === option.id }"
                  @click="sort = option.id"
                >
                  {{ option.label }}
                </button>
              </div>
              <label class="ledger-search">
                <input v-model="query" class="ledger-search-field" type="search" placeholder="Search lines" aria-label="Search lines" />
              </label>
            </div>

            <ol class="ledger-book">
              <li v-for="market in visibleMarkets" :key="market.id" class="ledger-entry">
                <div class="ledger-entry-code">
                  <span class="ledger-code">{{ market.code }}</span>
                  <span class="ledger-lane-name">{{ market.lane }}</span>
                  <span class="ledger-clock">{{ closesIn(market.hours) }}</span>
                </div>

                <div class="ledger-entry-main">
                  <h3 class="ledger-question">{{ market.question }}</h3>
                  <div class="ledger-entry-meta">
                    <span class="ledger-spark">
                      <svg viewBox="0 0 96 28" preserveAspectRatio="none" aria-hidden="true">
                        <path :d="sparkPath(market.spark)" fill="none" :class="market.move < 0 ? 'ledger-down' : 'ledger-up'" stroke-width="2" />
                      </svg>
                    </span>
                    <span class="ledger-split">yes <b>{{ market.yes }}</b> / no <b>{{ 100 - market.yes }}</b></span>
                    <span class="ledger-delta">
                      <em :class="market.move < 0 ? 'ledger-down' : 'ledger-up'">{{ market.move > 0 ? '+' : '' }}{{ market.move.toFixed(1) }}%</em>
                    </span>
                    <span class="ledger-volume">${{ (market.volume / 1000).toFixed(0) }}k</span>
                    <span class="ledger-heat">{{ market.traders }} in</span>
                  </div>
                </div>

                <div class="ledger-entry-quote">
                  <strong class="ledger-quote">{{ market.yes }}<i>%</i></strong>
                </div>

                <div class="ledger-entry-sides">
                  <button class="ledger-side ledger-side--yes" type="button" @click="openTrade(market, 'YES')">
                    yes<b>{{ market.yes }}%</b>
                  </button>
                  <button class="ledger-side ledger-side--no" type="button" @click="openTrade(market, 'NO')">
                    no<b>{{ 100 - market.yes }}%</b>
                  </button>
                  <p v-if="receiptFor(market.id)" class="ledger-slip">
                    you signed {{ receiptFor(market.id).side }} &middot; {{ receiptFor(market.id).stake }} SOL
                  </p>
                </div>
              </li>
            </ol>

            <p v-if="!visibleMarkets.length" class="ledger-empty">
              No line matches that. Clear the search or switch lanes.
            </p>
          </section>

          <section id="rules" class="ledger-rules">
            <div class="ledger-section-head">
              <p class="ledger-kicker">three moves</p>
              <h2 class="ledger-headline">HOW A POSITION GETS MADE</h2>
            </div>
            <ol class="ledger-moves">
              <li class="ledger-move">
                <b class="ledger-move-no">01</b>
                <div class="ledger-move-body">
                  <h3>Read the line</h3>
                  <p>The percentage on every card is the crowd's current read, refreshed as positions come in. It is a price, never a promise.</p>
                </div>
              </li>
              <li class="ledger-move">
                <b class="ledger-move-no">02</b>
                <div class="ledger-move-body">
                  <h3>Pick a side</h3>
                  <p>Back YES or NO. Both sides fund the same pool and settle on the same published rules, with no house seat at the table.</p>
                </div>
              </li>
              <li class="ledger-move">
                <b class="ledger-move-no">03</b>
                <div class="ledger-move-body">
                  <h3>Sign it yourself</h3>
                  <p>Your wallet builds and signs the transaction. Signaris never holds your key, and the signature is the receipt the chain keeps.</p>
                </div>
              </li>
            </ol>
            <p class="ledger-note">
              The market program is not deployed yet, so a signed position is recorded as an on-chain
              transaction rather than held in a settlement pool. When the program lands on this cluster,
              the same button routes the position into it and the pool settles on the published rules.
            </p>
          </section>

          <section id="desk" class="ledger-desk" :class="{ 'ledger-desk--live': connected }">
            <div class="ledger-desk-head">
              <span class="ledger-desk-glyph" aria-hidden="true">
                <svg viewBox="0 0 64 64" focusable="false">
                  <path d="M13 46 L26 46 L38 18 L51 18" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" />
                </svg>
              </span>
              <p class="ledger-kicker">your desk</p>
              <h2 class="ledger-headline ledger-headline--desk">{{ connected ? 'WALLET ONLINE' : 'WALLET DETACHED' }}</h2>
            </div>

            <div class="ledger-desk-nodes">
              <div class="ledger-node">
                <span>Address</span>
                <strong>{{ connected ? shortAddress : '---' }}</strong>
              </div>
              <div class="ledger-node">
                <span>Balance on {{ clusterLabel }}</span>
                <strong>{{ balanceText }} <i v-if="connected && !walletState.balanceError">SOL</i></strong>
              </div>
              <div class="ledger-node">
                <span>Signed positions</span>
                <strong>{{ String(receipts.length).padStart(2, '0') }}</strong>
              </div>
            </div>

            <div class="ledger-desk-acts">
              <a v-if="connected" class="ledger-action" :href="explorerUrl" target="_blank" rel="noreferrer">View on explorer</a>
              <button v-if="connected" class="ledger-action" type="button" @click="wallet.refreshBalance(); flash('Balance refreshed from ' + clusterLabel + '.')">
                Refresh balance
              </button>
              <button v-if="connected" class="ledger-action" type="button" @click="dropWallet">Detach wallet</button>
              <button v-else class="ledger-action ledger-action--fill" type="button" @click="openWallet">Attach wallet</button>
            </div>

            <ul v-if="receipts.length" class="ledger-slips">
              <li v-for="receipt in receipts.slice(0, 4)" :key="receipt.signature">
                <span class="ledger-slip-side" :class="receipt.side === 'YES' ? 'ledger-up' : 'ledger-down'">{{ receipt.side }}</span>
                <span class="ledger-slip-q">{{ receipt.question }}</span>
                <span class="ledger-slip-sig">{{ receipt.stake }} SOL &middot; {{ receipt.signature.slice(0, 8) }}&hellip;</span>
              </li>
            </ul>
          </section>
        </div>

        <section class="ledger-margin" role="complementary" aria-label="Arena readout">
          <div class="ledger-readout">
            <div class="ledger-readout-head">
              <span class="ledger-kicker">arena readout</span>
              <span class="ledger-stream"><i></i>streaming</span>
            </div>
            <dl class="ledger-stats">
              <div v-for="stat in arenaStats" :key="stat.label" class="ledger-stat">
                <dt>{{ stat.label }}</dt>
                <dd>{{ stat.value }}</dd>
              </div>
            </dl>
            <div class="ledger-pulse" aria-hidden="true">
              <span v-for="bar in 22" :key="bar" :style="{ height: `${14 + ((bar * 41) % 82)}%` }"></span>
            </div>
            <div class="ledger-readout-foot">
              <span class="ledger-seal-id">SIGNARIS-01</span>
              <button v-if="connected" class="ledger-chip" type="button" @click="openWallet">
                <span class="ledger-chip-dot"></span>
                {{ shortAddress }}
                <b>{{ balanceText }} SOL</b>
              </button>
              <button v-else class="ledger-chip" type="button" @click="openWallet">
                <span class="ledger-chip-dot"></span>
                <span>Attach wallet</span>
              </button>
              <span class="ledger-wallet-state">{{ connected ? `wallet ${shortAddress}` : 'wallet detached' }}</span>
            </div>
          </div>

          <dl class="ledger-facts">
            <div><dt>Network</dt><dd>Solana {{ clusterLabel }}</dd></div>
            <div><dt>Latest blockhash</dt><dd>{{ walletState.balanceAt ? 'streaming' : 'on demand' }}</dd></div>
            <div><dt>Wallet</dt><dd>{{ connected ? walletState.providerName : 'not attached' }}</dd></div>
          </dl>
        </section>
      </div>
    </main>

    <footer class="ledger-colophon">
      <div class="ledger-colophon-top">
        <span class="ledger-colophon-brand">Signaris <em>/ 2026</em></span>
        <span class="ledger-colophon-tag">Price the future. Sign the call.</span>
        <span class="ledger-colophon-net">
          Solana {{ clusterLabel }} &middot;
          <a :href="`https://explorer.solana.com/?cluster=${wallet.cluster}`" target="_blank" rel="noreferrer">explorer</a>
        </span>
      </div>
      <div class="ledger-colophon-bottom">
        <p class="ledger-strip-a">
          <span class="ledger-live"><i></i>LIVE</span>
          <span class="ledger-dim">{{ wallet.programId ? 'market program wired' : 'every position signed on-chain' }}</span>
        </p>
        <p class="ledger-strip-b">
          <span class="ledger-dim">cluster</span>
          <strong>{{ clusterLabel }}</strong>
          <span class="ledger-sep">/</span>
          <span class="ledger-dim">settlement</span>
          <strong>your key</strong>
        </p>
      </div>
    </footer>

    <div v-if="tradeOpen && active" class="ledger-veil" @click.self="closeTrade">
      <section class="ledger-plate" role="dialog" aria-modal="true" aria-labelledby="trade-title">
        <button class="ledger-plate-x" type="button" aria-label="Close" @click="closeTrade">&#215;</button>
        <p class="ledger-kicker">{{ active.code }} &middot; {{ active.lane }} &middot; {{ closesIn(active.hours) }}</p>
        <h2 id="trade-title" class="ledger-plate-title">{{ active.question }}</h2>
        <p class="ledger-plate-sub">Closes {{ active.closes }} &middot; settled on Solana {{ clusterLabel }}</p>

        <div class="ledger-sides" role="group" aria-label="Pick a side">
          <button type="button" class="ledger-plate-side" :class="{ 'ledger-on': side === 'YES' }" @click="side = 'YES'">
            <span>YES</span><b>{{ active.yes }}%</b>
          </button>
          <button type="button" class="ledger-plate-side" :class="{ 'ledger-on': side === 'NO' }" @click="side = 'NO'">
            <span>NO</span><b>{{ 100 - active.yes }}%</b>
          </button>
        </div>

        <label class="ledger-stake">
          <span>Stake</span>
          <input v-model="stake" type="number" min="0.01" step="0.01" inputmode="decimal" aria-label="Stake in SOL" />
          <b>SOL</b>
        </label>
        <p v-if="connected" class="ledger-hint">
          Wallet holds {{ balanceText }} SOL<span v-if="stakeTooLarge" class="ledger-warn"> - the stake plus the fee is above that.</span>
        </p>
        <p v-else class="ledger-hint">Attach a wallet to price this against your real balance.</p>

        <dl class="ledger-quote-table">
          <div><dt>Side price</dt><dd>{{ sidePrice }}%</dd></div>
          <div><dt>Payout if right</dt><dd class="ledger-strong">{{ payout.toFixed(2) }} SOL</dd></div>
          <div><dt>Net gain</dt><dd>{{ netGain >= 0 ? '+' : '' }}{{ netGain.toFixed(2) }} SOL</dd></div>
          <div><dt>Signed by</dt><dd>{{ connected ? shortAddress : 'no wallet' }}</dd></div>
        </dl>

        <p v-if="tradeError" class="ledger-error">{{ tradeError }}</p>

        <button class="ledger-action ledger-action--fill ledger-action--wide" type="button" :disabled="submitting" @click="submitTrade">
          <template v-if="!connected">Attach wallet to continue</template>
          <template v-else-if="submitting">Waiting for your wallet&hellip;</template>
          <template v-else>Sign {{ side }} position &middot; {{ stakeNumber.toFixed(2) }} SOL</template>
        </button>
        <p class="ledger-plate-note">
          Your wallet signs a real transaction carrying this position note, so the call is on the public
          record the moment it lands. Nothing moves without your approval.
        </p>
      </section>
    </div>

    <div v-if="walletOpen" class="ledger-veil" @click.self="walletOpen = false">
      <section class="ledger-plate" role="dialog" aria-modal="true" aria-labelledby="wallet-title">
        <button class="ledger-plate-x" type="button" aria-label="Close" @click="walletOpen = false">&#215;</button>
        <span class="ledger-plate-glyph" aria-hidden="true">
          <svg viewBox="0 0 64 64" focusable="false">
            <path d="M13 46 L26 46 L38 18 L51 18" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" />
          </svg>
        </span>
        <p class="ledger-kicker">{{ clusterLabel }} &middot; real wallet</p>
        <h2 id="wallet-title" class="ledger-plate-title">{{ connected ? 'YOUR DESK' : 'ATTACH YOUR WALLET' }}</h2>

        <template v-if="connected">
          <dl class="ledger-quote-table ledger-quote-table--left">
            <div><dt>Account</dt><dd>{{ shortAddress }}</dd></div>
            <div><dt>Wallet</dt><dd>{{ walletState.providerName }}</dd></div>
            <div><dt>Balance</dt><dd class="ledger-strong">{{ balanceText }} SOL</dd></div>
          </dl>
          <p v-if="walletState.balanceError" class="ledger-error">{{ walletState.balanceError }}</p>
          <div class="ledger-wallet-row">
            <button class="ledger-action" type="button" @click="wallet.refreshBalance()">Refresh</button>
            <a class="ledger-action" :href="explorerUrl" target="_blank" rel="noreferrer">Explorer</a>
            <button class="ledger-action" type="button" @click="dropWallet(); walletOpen = false">Detach</button>
          </div>
        </template>

        <template v-else>
          <p class="ledger-plate-sub">
            Signaris connects through the wallet extension you already run, on Solana {{ clusterLabel }}.
            Your key stays in the extension; this page only asks it to sign what you approve.
          </p>
          <p v-if="walletNotice" class="ledger-plate-note ledger-plate-note--lead">{{ walletNotice }}</p>
          <ul class="ledger-wallet-list">
            <li v-for="option in walletCatalog" :key="option.id">
              <button class="ledger-wallet-pick" type="button" :disabled="walletBusy || connecting" @click="connect(option.id)">
                <span class="ledger-wallet-name">{{ option.name }}</span>
                <span class="ledger-wallet-flag" :class="{ 'ledger-on': option.available }">
                  {{ option.available ? 'detected' : 'not installed' }}
                </span>
              </button>
            </li>
          </ul>
          <p v-if="walletError" class="ledger-error">{{ walletError }}</p>
          <a v-if="installUrl" class="ledger-action ledger-action--wide" :href="installUrl" target="_blank" rel="noreferrer">
            Get the wallet, then reload
          </a>
          <p class="ledger-plate-note">
            No wallet listed? Install Phantom, Solflare, Backpack, Glow or Brave Wallet and reload this page.
            Nothing is simulated here, so a wallet really has to be present.
          </p>
        </template>
      </section>
    </div>

    <transition name="pop">
      <p v-if="toast" class="ledger-toast" role="status" aria-live="polite">{{ toast }}</p>
    </transition>
  </div>
</template>

