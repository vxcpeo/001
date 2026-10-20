<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createWallet, describeError } from './solana.js'

/* ---------------------------------------------------------------------------
   Probenox - live prediction arena.
   Meridian skin: black ground, violet bloom, hairline orbit, mono gutters.
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
    const raw = localStorage.getItem('probenox.receipts.v1')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveReceipt(receipt) {
  receipts.value = [receipt, ...receipts.value].slice(0, 40)
  try {
    localStorage.setItem('probenox.receipts.v1', JSON.stringify(receipts.value))
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

const tickerItems = computed(() =>
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
    const note = `Probenox|${market.code}|${side.value}|${stakeNumber.value.toFixed(3)}SOL|${new Date().toISOString()}`
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
  <div class="orbital-shell">
    <div class="orb-sky" aria-hidden="true"></div>

    <main class="orb-main">
      <!-- ==================================================== signal tape -->
      <section class="orb-tape" aria-label="Latest lines">
        <div class="orb-tape-track">
          <span v-for="(item, index) in [...tickerItems, ...tickerItems]" :key="`${item.code}-${index}`" class="orb-tape-item">
            <b>{{ item.code }}</b>
            <span class="orb-tape-label">{{ item.label }}</span>
            <strong :class="item.move < 0 ? 'orb-is-down' : 'orb-is-up'">{{ item.yes }}%</strong>
            <em :class="item.move < 0 ? 'orb-is-down' : 'orb-is-up'">{{ item.move > 0 ? '+' : '' }}{{ item.move.toFixed(1) }}</em>
          </span>
        </div>
      </section>

      <div class="orb-stage">
        <!-- ===================================================== masthead -->
        <div class="orb-masthead">
          <span class="orb-hair" aria-hidden="true"></span>
          <a class="orb-seal" href="#feed" aria-label="Probenox home">
            <span class="orb-seal-glyph" aria-hidden="true">
              <svg viewBox="0 0 64 64" focusable="false">
                <rect width="64" height="64" rx="32" fill="#100f14" />
                <path d="M13 46 L26 46 L38 18 L51 18" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" />
                <rect x="22" y="9" width="20" height="3" fill="#bc97ff" />
              </svg>
            </span>
            <span class="orb-seal-word">PROBE<em>NOX</em></span>
          </a>
          <span class="orb-hair orb-hair--end" aria-hidden="true"></span>
        </div>

        <!-- ======================================================= orbit -->
        <div class="orb-ring">
          <div class="orb-halos" aria-hidden="true">
            <span class="orb-halo orb-halo--c"></span>
            <span class="orb-halo orb-halo--a"></span>
            <span class="orb-halo orb-halo--b"></span>
            <span class="orb-ticks"></span>
            <span class="orb-sweep"></span>
          </div>

          <nav class="orb-stations" aria-label="Primary">
            <a class="orb-station" href="#feed"><span class="orb-station-pip" aria-hidden="true"></span>Feed</a>
            <a class="orb-station" href="#rules"><span class="orb-station-pip" aria-hidden="true"></span>Rules</a>
            <a class="orb-station" href="#desk"><span class="orb-station-pip" aria-hidden="true"></span>Desk</a>
          </nav>

          <div class="orb-core">
            <p class="orb-kicker">Prediction arena &middot; Solana</p>
            <h1 class="orb-claim">
              <span>PRICE THE</span>
              <span>FUTURE.</span>
              <span>SIGN THE CALL.</span>
            </h1>
            <div class="orb-cta">
              <a class="orb-btn orb-btn--accent" href="#feed">Open the feed</a>
              <button class="orb-btn orb-btn--ghost" type="button" @click="connected ? openWallet() : openWallet()">
                {{ connected ? 'Your desk' : 'Attach a wallet' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ===================================================== aperture -->
        <div class="orb-aperture">
          <p class="orb-lede">
            Every question here runs as a live line. The crowd sets the number, you take a side, and the
            wallet in your pocket signs it &mdash; the extension you already run, on the cluster the
            readout names, with nothing standing in for your key.
            Probenox reads the chain you are actually on and pays out on the terms it publishes.
          </p>
          <dl class="orb-facts">
            <div><dt>Network</dt><dd>Solana {{ clusterLabel }}</dd></div>
            <div><dt>Latest blockhash</dt><dd>{{ walletState.balanceAt ? 'streaming' : 'on demand' }}</dd></div>
            <div><dt>Wallet</dt><dd>{{ connected ? walletState.providerName : 'not attached' }}</dd></div>
          </dl>
        </div>

        <!-- ============================================= secondary arc ---- -->
        <aside class="orb-metrics" aria-label="Arena readout">
          <div class="orb-metrics-head">
            <span class="orb-metrics-title">arena readout</span>
            <span class="orb-stream"><i></i>streaming</span>
          </div>
          <dl class="orb-metrics-arc">
            <div v-for="stat in arenaStats" :key="stat.label" class="orb-metric">
              <dt>{{ stat.label }}</dt>
              <dd>{{ stat.value }}</dd>
            </div>
          </dl>
          <div class="orb-pulse" aria-hidden="true">
            <span v-for="bar in 22" :key="bar" :style="{ height: `${14 + ((bar * 41) % 82)}%` }"></span>
          </div>
          <div class="orb-metrics-foot">
            <span class="orb-seal-id">PROBENOX-01</span>
            <button v-if="connected" class="orb-chip orb-chip--on" type="button" @click="openWallet">
              <span class="orb-chip-dot"></span>
              {{ shortAddress }}
              <b>{{ balanceText }} SOL</b>
            </button>
            <button v-else class="orb-chip" type="button" @click="openWallet">
              <span class="orb-chip-dot"></span>
              <span class="orb-chip-label">Attach wallet</span>
            </button>
            <span class="orb-wallet-state">{{ connected ? `wallet ${shortAddress}` : 'wallet detached' }}</span>
          </div>
        </aside>
      </div>

      <!-- ============================================================ feed -->
      <section id="feed" class="orb-lines">
        <div class="orb-lines-plate">
          <p class="orb-eyebrow">the feed</p>
          <h2 class="orb-lines-title">OPEN LINES</h2>
          <p class="orb-count"><span class="orb-pip" aria-hidden="true"></span>{{ visibleMarkets.length }} of {{ markets.length }} lines shown</p>
        </div>

        <div class="orb-lanes" role="tablist" aria-label="Lanes">
          <button
            v-for="tab in laneTabs"
            :key="tab.name"
            type="button"
            role="tab"
            class="orb-lane-tab"
            :aria-selected="lane === tab.name"
            :class="{ 'is-lit': lane === tab.name }"
            @click="lane = tab.name"
          >
            {{ tab.name }}<b>{{ tab.count }}</b>
          </button>
        </div>

        <div class="orb-tools">
          <div class="orb-sort" role="group" aria-label="Sort lines">
            <button
              v-for="option in sorts"
              :key="option.id"
              type="button"
              :class="{ 'is-lit': sort === option.id }"
              @click="sort = option.id"
            >
              {{ option.label }}
            </button>
          </div>
          <label class="orb-search">
            <input v-model="query" class="orb-search-field" type="search" placeholder="Search lines" aria-label="Search lines" />
          </label>
        </div>

        <div class="orb-rays">
          <article v-for="market in visibleMarkets" :key="market.id" class="orb-ray">
            <div
              class="orb-dial"
              role="img"
              :aria-label="`${market.yes} percent read yes, ${100 - market.yes} percent read no`"
              :style="{ '--p': market.yes + '%' }"
            >
              <strong class="orb-dial-figure">{{ market.yes }}<i>%</i></strong>
            </div>

            <div class="orb-ray-body">
              <div class="orb-ray-tags">
                <span class="orb-code">{{ market.code }}</span>
                <span class="orb-ray-lane">{{ market.lane }}</span>
                <span class="orb-clock">{{ closesIn(market.hours) }}</span>
              </div>
              <h3 class="orb-ray-q">{{ market.question }}</h3>
              <div class="orb-ray-meta">
                <span class="orb-spark">
                  <svg viewBox="0 0 96 28" preserveAspectRatio="none" aria-hidden="true">
                    <path :d="sparkPath(market.spark)" fill="none" :class="market.move < 0 ? 'orb-is-down' : 'orb-is-up'" stroke-width="2" />
                  </svg>
                </span>
                <span class="orb-split">yes <b>{{ market.yes }}</b> / no <b>{{ 100 - market.yes }}</b></span>
                <span class="orb-delta">
                  <em :class="market.move < 0 ? 'orb-is-down' : 'orb-is-up'">{{ market.move > 0 ? '+' : '' }}{{ market.move.toFixed(1) }}%</em>
                </span>
                <span class="orb-vol">${{ (market.volume / 1000).toFixed(0) }}k</span>
                <span class="orb-heat">{{ market.traders }} in</span>
              </div>
            </div>

            <div class="orb-ray-acts">
              <button class="orb-pick orb-pick--yes" type="button" @click="openTrade(market, 'YES')">
                yes<b>{{ market.yes }}%</b>
              </button>
              <button class="orb-pick orb-pick--no" type="button" @click="openTrade(market, 'NO')">
                no<b>{{ 100 - market.yes }}%</b>
              </button>
              <p v-if="receiptFor(market.id)" class="orb-ray-slip">
                you signed {{ receiptFor(market.id).side }} &middot; {{ receiptFor(market.id).stake }} SOL
              </p>
            </div>
          </article>
        </div>

        <p v-if="!visibleMarkets.length" class="orb-empty">
          No line matches that. Clear the search or switch lanes.
        </p>
      </section>

      <!-- =========================================================== steps -->
      <section id="rules" class="orb-moves">
        <div class="orb-moves-head">
          <p class="orb-eyebrow">three moves</p>
          <h2 class="orb-steps-title">HOW A POSITION GETS MADE</h2>
        </div>
        <ol class="orb-steps">
          <li class="orb-step">
            <b class="orb-step-node">01</b>
            <div class="orb-step-body">
              <h3>Read the line</h3>
              <p>The percentage on every card is the crowd's current read, refreshed as positions come in. It is a price, never a promise.</p>
            </div>
          </li>
          <li class="orb-step">
            <b class="orb-step-node">02</b>
            <div class="orb-step-body">
              <h3>Pick a side</h3>
              <p>Back YES or NO. Both sides fund the same pool and settle on the same published rules, with no house seat at the table.</p>
            </div>
          </li>
          <li class="orb-step">
            <b class="orb-step-node">03</b>
            <div class="orb-step-body">
              <h3>Sign it yourself</h3>
              <p>Your wallet builds and signs the transaction. Probenox never holds your key, and the signature is the receipt the chain keeps.</p>
            </div>
          </li>
        </ol>
        <p class="orb-step-note">
          The market program is not deployed yet, so a signed position is recorded as an on-chain
          transaction rather than held in a settlement pool. When the program lands on this cluster,
          the same button routes the position into it and the pool settles on the published rules.
        </p>
      </section>

      <!-- ============================================================ desk -->
      <section id="desk" class="orb-desk" :class="{ 'is-live': connected }">
        <div class="orb-desk-disc">
          <span class="orb-desk-glyph" aria-hidden="true">
            <svg viewBox="0 0 64 64" focusable="false">
              <path d="M13 46 L26 46 L38 18 L51 18" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" />
            </svg>
          </span>
          <p class="orb-eyebrow">your desk</p>
          <h2 class="orb-desk-title">{{ connected ? 'WALLET ONLINE' : 'WALLET DETACHED' }}</h2>
        </div>

        <div class="orb-desk-nodes">
          <div class="orb-node">
            <span>Address</span>
            <strong>{{ connected ? shortAddress : '---' }}</strong>
          </div>
          <div class="orb-node">
            <span>Balance on {{ clusterLabel }}</span>
            <strong>{{ balanceText }} <i v-if="connected && !walletState.balanceError">SOL</i></strong>
          </div>
          <div class="orb-node">
            <span>Signed positions</span>
            <strong>{{ String(receipts.length).padStart(2, '0') }}</strong>
          </div>
        </div>

        <div class="orb-desk-acts">
          <a v-if="connected" class="orb-btn orb-btn--ghost" :href="explorerUrl" target="_blank" rel="noreferrer">View on explorer</a>
          <button v-if="connected" class="orb-btn orb-btn--ghost" type="button" @click="wallet.refreshBalance(); flash('Balance refreshed from ' + clusterLabel + '.')">
            Refresh balance
          </button>
          <button v-if="connected" class="orb-btn orb-btn--ghost" type="button" @click="dropWallet">Detach wallet</button>
          <button v-else class="orb-btn orb-btn--accent" type="button" @click="openWallet">Attach wallet</button>
        </div>

        <ul v-if="receipts.length" class="orb-slips">
          <li v-for="receipt in receipts.slice(0, 4)" :key="receipt.signature">
            <span class="orb-slip-side" :class="receipt.side === 'YES' ? 'orb-is-up' : 'orb-is-down'">{{ receipt.side }}</span>
            <span class="orb-slip-q">{{ receipt.question }}</span>
            <span class="orb-slip-sig">{{ receipt.stake }} SOL &middot; {{ receipt.signature.slice(0, 8) }}&hellip;</span>
          </li>
        </ul>
      </section>
    </main>

    <!-- ============================================================ foot -->
    <footer class="orb-foot">
      <div class="orb-foot-band">
        <span class="orb-foot-brand">Probenox <em>/ 2026</em></span>
        <span class="orb-foot-tag">Price the future. Sign the call.</span>
        <span class="orb-foot-net">
          Solana {{ clusterLabel }} &middot;
          <a :href="`https://explorer.solana.com/?cluster=${wallet.cluster}`" target="_blank" rel="noreferrer">explorer</a>
        </span>
      </div>
      <div class="orb-foot-strip">
        <p class="orb-strip-a">
          <span class="orb-live"><i></i>LIVE</span>
          <span class="orb-dim">{{ wallet.programId ? 'market program wired' : 'every position signed on-chain' }}</span>
        </p>
        <p class="orb-strip-b">
          <span class="orb-dim">cluster</span>
          <strong>{{ clusterLabel }}</strong>
          <span class="orb-sep">/</span>
          <span class="orb-dim">settlement</span>
          <strong>your key</strong>
        </p>
      </div>
    </footer>

    <!-- ===================================================== trade sheet -->
    <div v-if="tradeOpen && active" class="orb-veil" @click.self="closeTrade">
      <section class="orb-sheet" role="dialog" aria-modal="true" aria-labelledby="trade-title">
        <button class="orb-sheet-x" type="button" aria-label="Close" @click="closeTrade">&#215;</button>
        <p class="orb-eyebrow">{{ active.code }} &middot; {{ active.lane }} &middot; {{ closesIn(active.hours) }}</p>
        <h2 id="trade-title" class="orb-sheet-title">{{ active.question }}</h2>
        <p class="orb-sheet-sub">Closes {{ active.closes }} &middot; settled on Solana {{ clusterLabel }}</p>

        <div class="orb-side-grid" role="group" aria-label="Pick a side">
          <button type="button" class="orb-side orb-side--yes" :class="{ 'is-lit': side === 'YES' }" @click="side = 'YES'">
            <span>YES</span><b>{{ active.yes }}%</b>
          </button>
          <button type="button" class="orb-side orb-side--no" :class="{ 'is-lit': side === 'NO' }" @click="side = 'NO'">
            <span>NO</span><b>{{ 100 - active.yes }}%</b>
          </button>
        </div>

        <label class="orb-stake">
          <span>Stake</span>
          <input v-model="stake" type="number" min="0.01" step="0.01" inputmode="decimal" aria-label="Stake in SOL" />
          <b>SOL</b>
        </label>
        <p v-if="connected" class="orb-hint">
          Wallet holds {{ balanceText }} SOL<span v-if="stakeTooLarge" class="orb-warn"> - the stake plus the fee is above that.</span>
        </p>
        <p v-else class="orb-hint">Attach a wallet to price this against your real balance.</p>

        <dl class="orb-quote">
          <div><dt>Side price</dt><dd>{{ sidePrice }}%</dd></div>
          <div><dt>Payout if right</dt><dd class="orb-strong">{{ payout.toFixed(2) }} SOL</dd></div>
          <div><dt>Net gain</dt><dd>{{ netGain >= 0 ? '+' : '' }}{{ netGain.toFixed(2) }} SOL</dd></div>
          <div><dt>Signed by</dt><dd>{{ connected ? shortAddress : 'no wallet' }}</dd></div>
        </dl>

        <p v-if="tradeError" class="orb-error">{{ tradeError }}</p>

        <button class="orb-btn orb-btn--accent orb-btn--wide" type="button" :disabled="submitting" @click="submitTrade">
          <template v-if="!connected">Attach wallet to continue</template>
          <template v-else-if="submitting">Waiting for your wallet&hellip;</template>
          <template v-else>Sign {{ side }} position &middot; {{ stakeNumber.toFixed(2) }} SOL</template>
        </button>
        <p class="orb-sheet-note">
          Your wallet signs a real transaction carrying this position note, so the call is on the public
          record the moment it lands. Nothing moves without your approval.
        </p>
      </section>
    </div>

    <!-- ==================================================== wallet sheet -->
    <div v-if="walletOpen" class="orb-veil" @click.self="walletOpen = false">
      <section class="orb-sheet" role="dialog" aria-modal="true" aria-labelledby="wallet-title">
        <button class="orb-sheet-x" type="button" aria-label="Close" @click="walletOpen = false">&#215;</button>
        <span class="orb-sheet-glyph" aria-hidden="true">
          <svg viewBox="0 0 64 64" focusable="false">
            <path d="M13 46 L26 46 L38 18 L51 18" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" />
          </svg>
        </span>
        <p class="orb-eyebrow">{{ clusterLabel }} &middot; real wallet</p>
        <h2 id="wallet-title" class="orb-sheet-title">{{ connected ? 'YOUR DESK' : 'ATTACH YOUR WALLET' }}</h2>

        <template v-if="connected">
          <dl class="orb-quote orb-quote--left">
            <div><dt>Account</dt><dd>{{ shortAddress }}</dd></div>
            <div><dt>Wallet</dt><dd>{{ walletState.providerName }}</dd></div>
            <div><dt>Balance</dt><dd class="orb-strong">{{ balanceText }} SOL</dd></div>
          </dl>
          <p v-if="walletState.balanceError" class="orb-error">{{ walletState.balanceError }}</p>
          <div class="orb-wallet-row">
            <button class="orb-btn orb-btn--ghost" type="button" @click="wallet.refreshBalance()">Refresh</button>
            <a class="orb-btn orb-btn--ghost" :href="explorerUrl" target="_blank" rel="noreferrer">Explorer</a>
            <button class="orb-btn orb-btn--ghost" type="button" @click="dropWallet(); walletOpen = false">Detach</button>
          </div>
        </template>

        <template v-else>
          <p class="orb-sheet-sub">
            Probenox connects through the wallet extension you already run, on Solana {{ clusterLabel }}.
            Your key stays in the extension; this page only asks it to sign what you approve.
          </p>
          <p v-if="walletNotice" class="orb-sheet-note orb-sheet-note--lead">{{ walletNotice }}</p>
          <ul class="orb-wallet-list">
            <li v-for="option in walletCatalog" :key="option.id">
              <button class="orb-wallet-pick" type="button" :disabled="walletBusy || connecting" @click="connect(option.id)">
                <span class="orb-wallet-name">{{ option.name }}</span>
                <span class="orb-wallet-state" :class="{ 'is-ready': option.available }">
                  {{ option.available ? 'detected' : 'not installed' }}
                </span>
              </button>
            </li>
          </ul>
          <p v-if="walletError" class="orb-error">{{ walletError }}</p>
          <a v-if="installUrl" class="orb-btn orb-btn--ghost orb-btn--wide" :href="installUrl" target="_blank" rel="noreferrer">
            Get the wallet, then reload
          </a>
          <p class="orb-sheet-note">
            No wallet listed? Install Phantom, Solflare, Backpack, Glow or Brave Wallet and reload this page.
            Nothing is simulated here, so a wallet really has to be present.
          </p>
        </template>
      </section>
    </div>

    <transition name="pop">
      <p v-if="toast" class="orb-toast" role="status" aria-live="polite">{{ toast }}</p>
    </transition>
  </div>
</template>
