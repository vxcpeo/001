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
        <span v-for="(item, index) in [...tickerItems, ...tickerItems]" :key="`${item.code}-${index}`" class="ledger-wire-item">
          <b>{{ item.code }}</b>
          <span class="ledger-wire-label">{{ item.label }}</span>
          <strong :class="item.move < 0 ? 'ledger-down' : 'ledger-up'">{{ item.yes }}%</strong>
          <em :class="item.move < 0 ? 'ledger-down' : 'ledger-up'">{{ item.move > 0 ? '+' : '' }}{{ item.move.toFixed(1) }}</em>
        </span>
      </div>
    </section>

    <main class="ledger-main">
      <section class="ledger-hero">
        <h1 class="ledger-claim">
          <span>PRICE THE</span>
          <span>FUTURE.</span>
          <span>SIGN THE CALL.</span>
        </h1>
        <div class="ledger-hero-actions">
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

        <aside class="ledger-margin" aria-label="Arena readout">
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
        </aside>
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
