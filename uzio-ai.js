/* Uzio AI: the orb's brain.
   A client-side assistant that knows the whole Uzio site (no server, no API key, no libraries).
   Part 1 is the engine (knowledge base + matcher), Part 2 is the chat panel that opens from the orb. */
(function (root, factory) {
  var api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.UzioAI = api;
})(typeof window !== 'undefined' ? window : globalThis, function (win) {
  'use strict';

  var LANGS = ['en', 'tr', 'fr', 'de'];
  function T(en, tr, fr, de) { return { en: en, tr: tr, fr: fr, de: de }; }

  /* ======================================================================
     PART 1 · KNOWLEDGE BASE
     k = keywords (all four languages, accents stripped), w = weight, t = title (also used for chips),
     a = answer (T(...) or a function), go = tabs to offer, rel = related topics to offer.
     ====================================================================== */
  var VIEW_NAME = {
    home:     T('Home', 'Ana Sayfa', 'Accueil', 'Start'),
    play:     T('Play', 'Oyna', 'Jouer', 'Spielen'),
    watch:    T('Watch', 'İzle', 'Regarder', 'Ansehen'),
    perks:    T('Perks', 'Avantajlar', 'Avantages', 'Extras'),
    'uzio-ai': T('Uzio AI', 'Uzio AI', 'Uzio AI', 'Uzio AI')
  };
  var OPEN = T('Open {v}', '{v} sayfasını aç', 'Ouvrir {v}', '{v} öffnen');

  var KB = [
    /* ---------- the basics ---------- */
    { id: 'about', t: T('What is Uzio?', 'Uzio nedir?', 'Qu’est-ce qu’Uzio ?', 'Was ist Uzio?'), w: 1.1,
      k: ['uzio', 'what is uzio', 'who are you', 'what is this', 'what is this site', 'what is this website', 'game master', 'nedir', 'nesin', 'kimsin', 'hakkinda', 'qu est ce', 'qui es tu', 'c est quoi', 'was ist', 'wer bist du', 'uber'],
      a: T('**Uzio** is a game hub with an AI game master. You play fast rounds, chase high scores, keep streaks alive, earn XP and coins, and unlock perks. The site has four tabs: **Home**, **Play**, **Watch**, **Perks**, plus **Uzio AI**, where I can build challenges around you.',
           '**Uzio**, yapay zekâ oyun ustası olan bir oyun merkezi. Hızlı turlar oynar, rekor kırar, serini korur, XP ve jeton kazanır, avantajların kilidini açarsın. Sitede **Ana Sayfa**, **Oyna**, **İzle**, **Avantajlar** ve sana göre meydan okumalar kurduğum **Uzio AI** sekmeleri var.',
           '**Uzio** est un hub de jeu avec un maître du jeu IA. Tu enchaînes des manches rapides, bats des records, gardes ta série, gagnes des XP et des pièces, et débloques des avantages. Le site a quatre onglets : **Accueil**, **Jouer**, **Regarder**, **Avantages**, plus **Uzio AI** où je crée des défis pour toi.',
           '**Uzio** ist ein Game-Hub mit einem KI-Spielleiter. Du spielst schnelle Runden, jagst Highscores, hältst deine Serie, sammelst XP und Münzen und schaltest Extras frei. Die Seite hat die Tabs **Start**, **Spielen**, **Ansehen**, **Extras** und **Uzio AI**, wo ich Challenges für dich baue.'),
      go: ['play'], rel: ['can', 'tabs', 'how'] },

    { id: 'can', t: T('What can you do?', 'Neler yapabilirsin?', 'Que sais-tu faire ?', 'Was kannst du?'),
      k: ['what can you do', 'help', 'capabilities', 'features', 'abilities', 'what do you know', 'neler yapabilirsin', 'ne yapabilirsin', 'yardim', 'que sais tu faire', 'aide', 'was kannst du', 'hilfe', 'kannst du'],
      a: T('I know everything on this site: every game mode, the video drops, the perk shop and its prices, XP, levels, coins, streaks, quests, events, languages, the menu and how your profile works. I can also **invent a challenge** for you on the spot. Try “give me a hard challenge”.',
           'Bu sitedeki her şeyi biliyorum: tüm oyun modları, video içerikleri, avantaj mağazası ve fiyatları, XP, seviyeler, jetonlar, seriler, görevler, etkinlikler, diller, menü ve profilin nasıl çalıştığı. Ayrıca anında sana **bir meydan okuma** üretebilirim. “Bana zor bir meydan okuma ver” de.',
           'Je connais tout sur ce site : chaque mode de jeu, les vidéos, la boutique d’avantages et ses prix, les XP, niveaux, pièces, séries, quêtes, événements, langues, le menu et ton profil. Je peux aussi **inventer un défi** sur-le-champ. Essaie « donne-moi un défi difficile ».',
           'Ich kenne alles auf dieser Seite: jeden Spielmodus, die Videos, den Perk-Shop samt Preisen, XP, Level, Münzen, Serien, Quests, Events, Sprachen, das Menü und dein Profil. Außerdem kann ich dir sofort **eine Challenge erfinden**. Sag einfach „gib mir eine schwere Challenge“.'),
      go: ['uzio-ai'], rel: ['challenge', 'play', 'perks'] },

    { id: 'how', t: T('How do I get started?', 'Nasıl başlarım?', 'Comment commencer ?', 'Wie fange ich an?'),
      k: ['get started', 'how to start', 'start', 'begin', 'how does it work', 'how do i play', 'how to play', 'tutorial', 'guide', 'nasil baslarim', 'nasil oynanir', 'baslamak', 'nasil calisir', 'comment commencer', 'comment jouer', 'comment ca marche', 'wie fange', 'wie spiele', 'wie funktioniert', 'anfangen'],
      a: T('1) Tell me your name and play style in the welcome screen. 2) Open **Play** and pick a mode, or hit **Surprise Me**. 3) Every round earns **XP** and **coins**; finish **daily quests** and keep your **streak** alive. 4) Spend coins in **Perks**, and ask **Uzio AI** whenever you want a custom challenge.',
           '1) Karşılama ekranında adını ve oyun tarzını söyle. 2) **Oyna** sekmesini aç ve bir mod seç ya da **Surprise Me** de. 3) Her tur **XP** ve **jeton** kazandırır; **günlük görevleri** bitir, **serini** koru. 4) Jetonları **Avantajlar** sekmesinde harca, özel bir meydan okuma için **Uzio AI**’a sor.',
           '1) Dis-moi ton prénom et ton style de jeu à l’écran d’accueil. 2) Ouvre **Jouer** et choisis un mode, ou **Surprise Me**. 3) Chaque manche rapporte des **XP** et des **pièces** ; termine les **quêtes du jour** et garde ta **série**. 4) Dépense tes pièces dans **Avantages** et demande à **Uzio AI** un défi sur mesure.',
           '1) Nenne mir im Willkommensbildschirm deinen Namen und Spielstil. 2) Öffne **Spielen** und wähle einen Modus oder **Surprise Me**. 3) Jede Runde bringt **XP** und **Münzen**; erledige **Tagesquests** und halte deine **Serie**. 4) Gib Münzen bei **Extras** aus und frag **Uzio AI** nach einer eigenen Challenge.'),
      go: ['play'], rel: ['modes', 'quests', 'onboarding'] },

    { id: 'tabs', t: T('The tabs', 'Sekmeler', 'Les onglets', 'Die Tabs'),
      k: ['tabs', 'tab', 'navigation', 'menu bar', 'sections', 'pages', 'where is', 'where can i find', 'sekmeler', 'sayfalar', 'nerede', 'onglets', 'pages', 'ou est', 'ou trouver', 'seiten', 'wo finde', 'navigieren'],
      a: T('The top bar has five tabs: **Home** (your hub: featured mission, quests, events), **Play** (8 game modes), **Watch** (6 video drops), **Perks** (status, wallet and shop) and **Uzio AI** (your game master). On the right: search, and the account menu with language and dark mode.',
           'Üst çubukta beş sekme var: **Ana Sayfa** (öne çıkan görev, görevler, etkinlikler), **Oyna** (8 oyun modu), **İzle** (6 video), **Avantajlar** (durum, cüzdan, mağaza) ve **Uzio AI** (oyun ustan). Sağda arama ile dil ve karanlık mod içeren hesap menüsü var.',
           'La barre du haut a cinq onglets : **Accueil** (mission à la une, quêtes, événements), **Jouer** (8 modes), **Regarder** (6 vidéos), **Avantages** (statut, portefeuille, boutique) et **Uzio AI**. À droite : la recherche et le menu du compte (langue, mode sombre).',
           'Die obere Leiste hat fünf Tabs: **Start** (Mission, Quests, Events), **Spielen** (8 Modi), **Ansehen** (6 Videos), **Extras** (Status, Wallet, Shop) und **Uzio AI**. Rechts: Suche und das Kontomenü mit Sprache und Dunkelmodus.'),
      go: ['home'], rel: ['search', 'menu', 'home'] },

    /* ---------- home ---------- */
    { id: 'home', t: T('Home', 'Ana Sayfa', 'Accueil', 'Start'),
      k: ['home', 'hub', 'dashboard', 'main page', 'landing', 'ana sayfa', 'anasayfa', 'accueil', 'start seite', 'startseite', 'enter the game', 'oyuna gir'],
      a: T('**Home** is your hub. It shows the **Featured mission** (Neon Vault), a **Jump in** row with Play, Perks, Watch and Uzio AI, an **Uzio challenge drop**, your **Daily quests** and the current **Limited-time event**. The very first page (the landing page) says “Meet Uzio. Your game master.” with **Enter the game** and **Quick play**.',
           '**Ana Sayfa** senin merkezin. **Öne çıkan görev** (Neon Vault), Oyna/Avantajlar/İzle/Uzio AI için **Hemen başla** satırı, bir **Uzio meydan okuma önerisi**, **günlük görevlerin** ve güncel **sınırlı süreli etkinlik** burada. İlk sayfa (açılış) “Uzio ile tanış. Oyun ustan.” der ve **Oyuna gir** ile **Hızlı oyun** butonlarını sunar.',
           '**Accueil** est ton hub : la **mission à la une** (Neon Vault), une rangée **Jump in** vers Jouer, Avantages, Regarder et Uzio AI, un **défi d’Uzio**, tes **quêtes du jour** et l’**événement limité**. La page d’arrivée affiche « Découvre Uzio » avec **Entrer** et **Jeu rapide**.',
           '**Start** ist dein Hub: die **Featured Mission** (Neon Vault), eine **Jump in**-Reihe zu Spielen, Extras, Ansehen und Uzio AI, ein **Uzio-Challenge-Drop**, deine **Tagesquests** und das **zeitlich begrenzte Event**. Die Startseite zeigt „Lerne Uzio kennen“ mit **Enter the game** und **Schnelles Spiel**.'),
      go: ['home'], rel: ['mission', 'quests', 'event'] },

    { id: 'mission', t: T('Neon Vault mission', 'Neon Vault görevi', 'Mission Neon Vault', 'Neon-Vault-Mission'),
      k: ['neon vault', 'neon kasa', 'kasa', 'neon', 'vault', 'featured mission', 'mission', 'featured', 'continue', 'one cikan gorev', 'gorev', 'mission a la une', 'mission en vedette', 'featured mission'],
      a: T('**Neon Vault** is the featured mission on Home: clear **3 rounds**, keep your combo alive and crack the final vault. You’re **60% through**, with about **4 minutes left**, **+120 XP** on the line and a **2× combo** running. Hit **Continue** to pick it up.',
           '**Neon Vault** (sitede “Neon Kasa”), Ana Sayfa’daki öne çıkan görev: **3 turu** bitir, kombonu koru ve son kasayı aç. **%60** tamamlandı, yaklaşık **4 dk** kaldı, **+120 XP** ve **2× kombo** seni bekliyor. Devam etmek için **Devam et**’e bas.',
           '**Neon Vault** est la mission à la une : termine **3 manches**, garde ton combo et ouvre le coffre final. Tu es à **60 %**, il reste environ **4 min**, **+120 XP** à gagner et un **combo 2×** en cours. Appuie sur **Continuer**.',
           '**Neon Vault** ist die Featured Mission: Schließe **3 Runden** ab, halte deine Combo und knacke den finalen Tresor. Du bist bei **60 %**, es bleiben etwa **4 Min.**, **+120 XP** warten und eine **2×-Combo** läuft. Tippe auf **Weiter**.'),
      go: ['home'], rel: ['quests', 'xp', 'combo'] },

    { id: 'quests', t: T('Daily quests', 'Günlük görevler', 'Quêtes du jour', 'Tagesquests'),
      k: ['daily quest', 'daily quests', 'quest', 'quests', 'daily', 'score hunter', 'combo keeper', 'uzio dare', 'dare', 'task', 'challenge of the day', 'gunluk gorev', 'gorevler', 'gunluk', 'quete', 'quetes', 'quete du jour', 'tagesquest', 'quests', 'taglich', 'aufgabe'],
      a: T('There are **3 daily quests** (2/3 complete right now): ✅ **Score Hunter** (beat one personal best), ✅ **Combo Keeper** (reach a 5× combo) and ⭕ **Uzio Dare** (complete one AI-generated challenge). Stuck on one? A **Reroll Token** (90 coins) swaps a daily quest instantly.',
           '**3 günlük görev** var (şu an 2/3 tamam): ✅ **Score Hunter** (bir kişisel rekoru geç), ✅ **Combo Keeper** (5× kombo yap) ve ⭕ **Uzio Dare** (yapay zekânın ürettiği bir meydan okumayı tamamla). Takıldın mı? **Reroll Token** (90 jeton) bir görevi anında değiştirir.',
           'Il y a **3 quêtes du jour** (2/3 terminées) : ✅ **Score Hunter** (battre un record perso), ✅ **Combo Keeper** (atteindre un combo 5×) et ⭕ **Uzio Dare** (finir un défi généré par l’IA). Bloqué ? Un **Reroll Token** (90 pièces) change une quête.',
           'Es gibt **3 Tagesquests** (aktuell 2/3 erledigt): ✅ **Score Hunter** (einen persönlichen Rekord schlagen), ✅ **Combo Keeper** (5×-Combo erreichen) und ⭕ **Uzio Dare** (eine KI-Challenge abschließen). Hängst du fest? Ein **Reroll Token** (90 Münzen) tauscht eine Quest sofort.'),
      go: ['home'], rel: ['challenge', 'shop', 'event'] },

    { id: 'event', t: T('Double XP Hour', 'Çift XP Saati', 'Heure XP double', 'Double-XP-Stunde'),
      k: ['event', 'events', 'double xp', 'double xp hour', 'limited time', 'limited-time', 'timer', 'mystery perk', 'etkinlik', 'cift xp', 'sinirli', 'evenement', 'xp double', 'heure', 'veranstaltung', 'doppelte xp', 'begrenzt'],
      a: T('The current **limited-time event** is **Double XP Hour**: complete **any three games** before the timer expires to unlock a **mystery perk**. You can jump in from the Home tab with **Enter event**.',
           'Güncel **sınırlı süreli etkinlik** **Çift XP Saati**: süre dolmadan **herhangi üç oyunu** tamamla ve **gizemli bir avantajın** kilidini aç. Ana Sayfa’dan **Etkinliğe gir** ile katılabilirsin.',
           'L’**événement limité** actuel est l’**Heure XP double** : termine **trois jeux** avant la fin du minuteur pour débloquer un **avantage mystère**. Rejoins-le depuis Accueil avec **Enter event**.',
           'Das aktuelle **zeitlich begrenzte Event** ist die **Double-XP-Stunde**: Schließe **drei beliebige Spiele** ab, bevor der Timer abläuft, und schalte einen **Mystery Perk** frei. Starte über **Enter event** auf Start.'),
      go: ['home'], rel: ['xp', 'boost', 'quests'] },

    /* ---------- play ---------- */
    { id: 'modes', t: T('Game modes', 'Oyun modları', 'Modes de jeu', 'Spielmodi'),
      k: ['game modes', 'modes', 'mode', 'games', 'game', 'play', 'all games', 'which games', 'list of games', 'oyun', 'oyunlar', 'modlar', 'oyna', 'jeux', 'jeu', 'modes de jeu', 'jouer', 'spiele', 'spiel', 'spielen', 'modi'],
      a: T('**Play** has 8 modes:\n⚡ **Rapid Fire** (90 sec, score attack)\n👾 **Boss Battle** (5 min, +180 XP)\n🧩 **Puzzle Drop** (3 min, logic)\n🎯 **Perfect Run** (hard, combo)\n🏁 **Beat Uzio** (2 min, AI duel)\n💥 **Risk It** (high stakes, coins)\n🗺️ **Quest Run** (6–8 min, adventure)\n🎲 **Surprise Me** (random, bonus XP).\nAsk me about any of them!',
           '**Oyna** sekmesinde 8 mod var:\n⚡ **Rapid Fire** (90 sn, skor saldırısı)\n👾 **Boss Battle** (5 dk, +180 XP)\n🧩 **Puzzle Drop** (3 dk, mantık)\n🎯 **Perfect Run** (zor, kombo)\n🏁 **Beat Uzio** (2 dk, yapay zekâ düellosu)\n💥 **Risk It** (yüksek risk, jeton)\n🗺️ **Quest Run** (6–8 dk, macera)\n🎲 **Surprise Me** (rastgele, bonus XP).\nHerhangi birini sorabilirsin!',
           '**Jouer** propose 8 modes :\n⚡ **Rapid Fire** (90 s, attaque de score)\n👾 **Boss Battle** (5 min, +180 XP)\n🧩 **Puzzle Drop** (3 min, logique)\n🎯 **Perfect Run** (difficile, combo)\n🏁 **Beat Uzio** (2 min, duel IA)\n💥 **Risk It** (gros enjeux, pièces)\n🗺️ **Quest Run** (6–8 min, aventure)\n🎲 **Surprise Me** (aléatoire, XP bonus).\nDemande-moi des détails sur n’importe lequel !',
           '**Spielen** hat 8 Modi:\n⚡ **Rapid Fire** (90 Sek., Score-Attacke)\n👾 **Boss Battle** (5 Min., +180 XP)\n🧩 **Puzzle Drop** (3 Min., Logik)\n🎯 **Perfect Run** (schwer, Combo)\n🏁 **Beat Uzio** (2 Min., KI-Duell)\n💥 **Risk It** (hohes Risiko, Münzen)\n🗺️ **Quest Run** (6–8 Min., Abenteuer)\n🎲 **Surprise Me** (zufällig, Bonus-XP).\nFrag mich zu jedem davon!'),
      go: ['play'], rel: ['rapid', 'boss', 'surprise'] },

    { id: 'rapid', t: T('Rapid Fire', 'Rapid Fire', 'Rapid Fire', 'Rapid Fire'),
      k: ['rapid fire', 'rapid', 'fire', 'score attack', 'speed', 'fast', 'hizli', 'rapide', 'schnell'],
      a: T('⚡ **Rapid Fire** is the score-attack mode: answer, react and build a combo before the clock runs out. It lasts **90 seconds**, so it’s the quickest way to chase a personal best (and tick off **Score Hunter**).',
           '⚡ **Rapid Fire** skor saldırısı modu: süre bitmeden cevap ver, tepki göster ve kombo kur. **90 saniye** sürer; kişisel rekor kovalamanın (ve **Score Hunter** görevini bitirmenin) en hızlı yolu.',
           '⚡ **Rapid Fire** est le mode attaque de score : réponds, réagis et construis un combo avant la fin du temps. Il dure **90 secondes**, idéal pour battre un record (et valider **Score Hunter**).',
           '⚡ **Rapid Fire** ist der Score-Attack-Modus: antworte, reagiere und baue eine Combo auf, bevor die Zeit abläuft. Er dauert **90 Sekunden** – der schnellste Weg zum persönlichen Rekord (und für **Score Hunter**).'),
      go: ['play'], rel: ['combo', 'modes', 'perfect'] },

    { id: 'boss', t: T('Boss Battle', 'Boss Battle', 'Boss Battle', 'Boss Battle'),
      k: ['boss battle', 'boss', 'bosses', 'final boss', 'stages', 'patron', 'boss savasi', 'savas', 'bosskampf', 'endgegner'],
      a: T('👾 **Boss Battle**: survive **three stages** and defeat the final boss. It takes about **5 minutes** and pays **+180 XP**. It also has a **trailer** in Watch (“Boss Battle: new mode reveal”), and Uzio AI can **generate a custom boss** with escalating rules.',
           '👾 **Boss Battle**: **üç aşamadan** sağ çık ve son boss’u yen. Yaklaşık **5 dakika** sürer ve **+180 XP** verir. İzle sekmesinde bir **fragmanı** var (“Boss Battle: new mode reveal”); Uzio AI de zorluğu giderek artan **özel bir boss** üretebilir.',
           '👾 **Boss Battle** : survis à **trois étapes** et bats le boss final. Compte environ **5 minutes** et **+180 XP**. Il a une **bande-annonce** dans Regarder, et Uzio AI peut **générer un boss sur mesure** aux règles croissantes.',
           '👾 **Boss Battle**: Überlebe **drei Stufen** und besiege den Endboss. Dauer etwa **5 Minuten**, Belohnung **+180 XP**. Es gibt einen **Trailer** bei Ansehen, und Uzio AI kann einen **eigenen Boss** mit steigenden Regeln erzeugen.'),
      go: ['play', 'watch'], rel: ['uzioai', 'xp', 'modes'] },

    { id: 'puzzle', t: T('Puzzle Drop', 'Puzzle Drop', 'Puzzle Drop', 'Puzzle Drop'),
      k: ['puzzle drop', 'puzzle', 'puzzles', 'logic', 'clues', 'hints', 'bulmaca', 'mantik', 'ipucu', 'enigme', 'indices', 'logique', 'ratsel', 'hinweise', 'logik'],
      a: T('🧩 **Puzzle Drop**: solve a chain of clues. The fewer hints you use, the more points you earn. About **3 minutes**, category: **Logic**.',
           '🧩 **Puzzle Drop**: bir ipucu zincirini çöz. Ne kadar az ipucu kullanırsan o kadar çok puan alırsın. Yaklaşık **3 dakika**, kategori: **Mantık**.',
           '🧩 **Puzzle Drop** : résous une chaîne d’indices. Moins tu utilises d’aides, plus tu marques de points. Environ **3 minutes**, catégorie **Logique**.',
           '🧩 **Puzzle Drop**: Löse eine Kette von Hinweisen. Je weniger Tipps du nutzt, desto mehr Punkte gibt es. Etwa **3 Minuten**, Kategorie **Logik**.'),
      go: ['play'], rel: ['modes', 'perfect', 'uzioai'] },

    { id: 'perfect', t: T('Perfect Run', 'Perfect Run', 'Perfect Run', 'Perfect Run'),
      k: ['perfect run', 'perfect', 'one mistake', 'multiplier', 'mukemmel', 'kusursuz', 'carpan', 'parfait', 'multiplicateur', 'perfekt', 'multiplikator'],
      a: T('🎯 **Perfect Run** is the hard one: a single mistake resets your multiplier. How far can you go? It’s labelled **Hard** with a **Combo** focus. A **Combo Saver** perk (160 coins) lets you keep the multiplier after one mistake.',
           '🎯 **Perfect Run** zor olanı: tek bir hata çarpanını sıfırlar. Ne kadar ileri gidebilirsin? **Zor** etiketli ve **Kombo** odaklı. **Combo Saver** avantajı (160 jeton) bir hatadan sonra çarpanını korumana izin verir.',
           '🎯 **Perfect Run** est le mode difficile : une seule erreur remet ton multiplicateur à zéro. Jusqu’où iras-tu ? Étiquette **Difficile**, focus **Combo**. Le perk **Combo Saver** (160 pièces) garde le multiplicateur après une erreur.',
           '🎯 **Perfect Run** ist der harte Modus: Ein einziger Fehler setzt deinen Multiplikator zurück. Wie weit kommst du? Label **Hard**, Fokus **Combo**. Der **Combo Saver** (160 Münzen) rettet den Multiplikator nach einem Fehler.'),
      go: ['play', 'perks'], rel: ['combo', 'shop', 'rapid'] },

    { id: 'beatuzio', t: T('Beat Uzio', 'Beat Uzio', 'Beat Uzio', 'Beat Uzio'),
      k: ['beat uzio', 'duel', 'race', 'ai duel', 'versus', 'vs', 'head to head', 'steal', 'multiplayer', 'friend', 'friends', 'pvp', 'dugello', 'yaris', 'arkadas', 'duel', 'course', 'ami', 'amis', 'copain', 'duell', 'rennen', 'freund', 'freunde'],
      a: T('🏁 **Beat Uzio** is an **AI duel**: race Uzio to the answer and steal the bonus. It takes about **2 minutes**. For playing against people: Play describes **multiplayer-style missions**, and one of the Uzio AI quick prompts is “Make a head-to-head challenge I can play with a friend.” Right now that’s a preview rather than live matchmaking.',
           '🏁 **Beat Uzio** bir **yapay zekâ düellosu**: cevaba Uzio’dan önce ulaş ve bonusu çal. Yaklaşık **2 dakika** sürer. İnsanlarla oynamak için: Oyna sekmesi **çok oyunculu tarzda görevlerden** söz eder, Uzio AI hızlı komutlarından biri “Arkadaşımla oynayabileceğim bir kafa kafaya meydan okuma yap” der. Şu an bu canlı eşleşme değil, bir önizleme.',
           '🏁 **Beat Uzio** est un **duel contre l’IA** : arrive avant Uzio à la réponse et vole le bonus. Environ **2 minutes**. Pour jouer contre des humains : Jouer parle de **missions de style multijoueur** et un des prompts d’Uzio AI propose un défi en tête-à-tête avec un ami. Pour l’instant, c’est un aperçu, pas du matchmaking en direct.',
           '🏁 **Beat Uzio** ist ein **KI-Duell**: Sei vor Uzio bei der Antwort und stiehl den Bonus. Dauer etwa **2 Minuten**. Gegen Menschen: Spielen erwähnt **Multiplayer-Missionen**, und einer der Uzio-AI-Prompts lautet „Mach eine Head-to-Head-Challenge für mich und einen Freund“. Aktuell ist das eine Vorschau, kein Live-Matchmaking.'),
      go: ['play'], rel: ['modes', 'uzioai', 'rapid'] },

    { id: 'risk', t: T('Risk It', 'Risk It', 'Risk It', 'Risk It'),
      k: ['risk it', 'risk', 'gamble', 'high stakes', 'safer reward', 'bet', 'risk', 'kumar', 'riziko', 'yuksek risk', 'risque', 'gros enjeux', 'parier', 'risiko', 'wetten', 'hohes risiko'],
      a: T('💥 **Risk It** is the high-stakes mode: choose the **safer reward** or **gamble your points** for more. It plays with **coins** as the prize.',
           '💥 **Risk It** yüksek riskli mod: **güvenli ödülü** seç ya da daha fazlası için **puanlarını riske at**. Ödül olarak **jeton** kazandırır.',
           '💥 **Risk It** est le mode à gros enjeux : choisis la **récompense sûre** ou **mise tes points** pour plus. Il rapporte des **pièces**.',
           '💥 **Risk It** ist der High-Stakes-Modus: Wähle die **sichere Belohnung** oder **setze deine Punkte** für mehr aufs Spiel. Der Preis sind **Münzen**.'),
      go: ['play'], rel: ['coins', 'perfect', 'modes'] },

    { id: 'questrun', t: T('Quest Run', 'Quest Run', 'Quest Run', 'Quest Run'),
      k: ['quest run', 'adventure', 'map', 'chest', 'connected', 'macera', 'harita', 'sandik', 'aventure', 'carte', 'coffre', 'abenteuer', 'karte', 'truhe'],
      a: T('🗺️ **Quest Run**: clear connected mini-games to reach the final chest. It takes **6–8 minutes**, the longest mode, with an **Adventure** feel. There’s a Watch video previewing the new Quest Run map, and Uzio AI can **build a quest** from several games.',
           '🗺️ **Quest Run**: bağlantılı mini oyunları bitirip son sandığa ulaş. **6–8 dakika** süren en uzun mod, **Macera** havasında. İzle sekmesinde yeni Quest Run haritasını gösteren bir video var; Uzio AI de birkaç oyundan **bir görev zinciri kurabilir**.',
           '🗺️ **Quest Run** : enchaîne des mini-jeux reliés jusqu’au coffre final. **6–8 minutes**, le mode le plus long, ambiance **Aventure**. Une vidéo dans Regarder présente la nouvelle carte, et Uzio AI peut **construire une quête**.',
           '🗺️ **Quest Run**: Meistere verbundene Minispiele bis zur finalen Truhe. **6–8 Minuten**, der längste Modus, mit **Abenteuer**-Gefühl. Bei Ansehen gibt es ein Video zur neuen Karte, und Uzio AI kann eine **Quest bauen**.'),
      go: ['play', 'watch'], rel: ['modes', 'uzioai', 'videos'] },

    { id: 'surprise', t: T('Surprise Me', 'Surprise Me', 'Surprise Me', 'Surprise Me'),
      k: ['surprise me', 'surprise', 'random', 'randomize', 'sasirt', 'rastgele', 'surprends', 'aleatoire', 'uberrasch', 'zufall', 'zufallig'],
      a: T('🎲 **Surprise Me**: no choosing, Uzio picks the **mode, rule and difficulty** for you. It’s random and comes with **bonus XP**.',
           '🎲 **Surprise Me**: seçim yok, **modu, kuralı ve zorluğu** Uzio belirler. Rastgele ve **bonus XP** içerir.',
           '🎲 **Surprise Me** : pas de choix, Uzio sélectionne le **mode, la règle et la difficulté**. Aléatoire, avec des **XP bonus**.',
           '🎲 **Surprise Me**: Keine Auswahl, Uzio bestimmt **Modus, Regel und Schwierigkeit**. Zufällig und mit **Bonus-XP**.'),
      go: ['play'], rel: ['modes', 'challenge', 'boss'] },

    /* ---------- watch ---------- */
    { id: 'videos', t: T('Watch videos', 'İzle videoları', 'Vidéos', 'Videos'),
      k: ['watch', 'video', 'videos', 'clips', 'clip', 'trailer', 'trailers', 'drops', 'strategy drop', 'quick tip', 'preview', 'uzio lab', 'reward drop', 'new', 'izle', 'fragman', 'klip', 'regarder', 'vidos', 'bande annonce', 'ansehen', 'anschauen', 'trailer'],
      a: T('**Watch** has 6 drops:\n🏆 How top players protect a streak (Strategy Drop · 2:10)\n👾 Boss Battle: new mode reveal (Mode Trailer · 1:35) **NEW**\n⚡ 3 tricks for a higher combo (Quick Tip · 2:20) **NEW**\n🎁 Mystery Perks explained (Reward Drop · 2:05)\n🗺️ Inside the new Quest Run map (Preview · 3:15)\n🤖 Uzio AI creates an impossible challenge (Uzio Lab · 2:50)\nSome clips unlock quests, boosts or secret game modes, and you can ⭐ save videos for later.',
           '**İzle** sekmesinde 6 video var:\n🏆 How top players protect a streak (Strateji · 2:10)\n👾 Boss Battle: new mode reveal (Mod fragmanı · 1:35) **YENİ**\n⚡ 3 tricks for a higher combo (Hızlı ipucu · 2:20) **YENİ**\n🎁 Mystery Perks explained (Ödül · 2:05)\n🗺️ Inside the new Quest Run map (Önizleme · 3:15)\n🤖 Uzio AI creates an impossible challenge (Uzio Lab · 2:50)\nBazı klipler görev, boost veya gizli modların kilidini açar; videoları ⭐ ile sonrası için kaydedebilirsin.',
           '**Regarder** propose 6 vidéos :\n🏆 How top players protect a streak (Strategy Drop · 2:10)\n👾 Boss Battle: new mode reveal (Bande-annonce · 1:35) **NEW**\n⚡ 3 tricks for a higher combo (Astuce · 2:20) **NEW**\n🎁 Mystery Perks explained (Reward Drop · 2:05)\n🗺️ Inside the new Quest Run map (Aperçu · 3:15)\n🤖 Uzio AI creates an impossible challenge (Uzio Lab · 2:50)\nCertains clips débloquent des quêtes, boosts ou modes secrets, et tu peux ⭐ les sauvegarder.',
           '**Ansehen** hat 6 Drops:\n🏆 How top players protect a streak (Strategy Drop · 2:10)\n👾 Boss Battle: new mode reveal (Mode-Trailer · 1:35) **NEU**\n⚡ 3 tricks for a higher combo (Quick Tip · 2:20) **NEU**\n🎁 Mystery Perks explained (Reward Drop · 2:05)\n🗺️ Inside the new Quest Run map (Vorschau · 3:15)\n🤖 Uzio AI creates an impossible challenge (Uzio Lab · 2:50)\nManche Clips schalten Quests, Boosts oder Geheimmodi frei; Videos kannst du mit ⭐ speichern.'),
      go: ['watch'], rel: ['boss', 'questrun', 'shop'] },

    /* ---------- perks, status, money ---------- */
    { id: 'perks', t: T('Perks', 'Avantajlar', 'Avantages', 'Extras'),
      k: ['perks', 'perk', 'rewards', 'reward', 'collection', 'status', 'cosmetic', 'cosmetics', 'collectibles', 'avantaj', 'avantajlar', 'odul', 'oduller', 'koleksiyon', 'avantages', 'recompense', 'recompenses', 'belohnung', 'belohnungen', 'extras', 'sammlung'],
      a: T('**Perks** is where your progress lives: **Player status** (2,340 XP, level ring), your **Wallet** (640 coins, 4-day streak, 12 badges, 3 rare items), the **Perk shop** (5 boosts, rotating regularly) and your **Next unlock** (Mystery Profile Aura at Level 8).',
           '**Avantajlar** ilerlemenin yaşadığı yer: **Oyuncu durumu** (2.340 XP, seviye halkası), **Cüzdan** (640 jeton, 4 günlük seri, 12 rozet, 3 nadir eşya), **Avantaj mağazası** (düzenli yenilenen 5 boost) ve **Sıradaki kilit** (8. seviyede Mystery Profile Aura).',
           '**Avantages** est le centre de ta progression : **Statut du joueur** (2 340 XP, anneau de niveau), ton **Portefeuille** (640 pièces, série de 4 jours, 12 badges, 3 objets rares), la **boutique** (5 boosts, renouvelée régulièrement) et ton **prochain déblocage** (Mystery Profile Aura au niveau 8).',
           '**Extras** ist dein Fortschritts-Zentrum: **Spielerstatus** (2.340 XP, Level-Ring), dein **Wallet** (640 Münzen, 4-Tage-Serie, 12 Badges, 3 seltene Items), der **Perk-Shop** (5 Boosts, regelmäßig wechselnd) und dein **nächster Unlock** (Mystery Profile Aura auf Level 8).'),
      go: ['perks'], rel: ['shop', 'xp', 'coins'] },

    { id: 'shop', t: T('Perk shop & prices', 'Mağaza ve fiyatlar', 'Boutique et prix', 'Shop & Preise'),
      k: ['shop', 'store', 'buy', 'purchase', 'price', 'prices', 'cost', 'how much', 'streak shield', 'shield', 'xp booster', 'booster', 'coute', 'kostet', 'reroll', 'reroll token', 'rare drop', 'combo saver', 'boost', 'boosts', 'magaza', 'satin al', 'fiyat', 'fiyatlar', 'ne kadar', 'kac jeton', 'boutique', 'acheter', 'prix', 'combien', 'kaufen', 'preis', 'preise', 'wie viel', 'kosten'],
      a: T('The **Perk shop** sells 5 items:\n🛡️ **Streak Shield** · 120 coins (protect one missed day)\n⚡ **XP Booster** · 180 coins (2× XP for 20 minutes)\n🎲 **Reroll Token** · 90 coins (swap one daily quest)\n💎 **Rare Drop** · 250 coins (random premium cosmetic)\n🔥 **Combo Saver** · 160 coins (keep your multiplier after one mistake)\nStock rotates regularly. You currently have 🪙 **640 coins**.',
           '**Avantaj mağazasında** 5 ürün var:\n🛡️ **Streak Shield** · 120 jeton (kaçırılan bir günü korur)\n⚡ **XP Booster** · 180 jeton (20 dk boyunca 2× XP)\n🎲 **Reroll Token** · 90 jeton (bir günlük görevi değiştirir)\n💎 **Rare Drop** · 250 jeton (rastgele premium kozmetik)\n🔥 **Combo Saver** · 160 jeton (bir hatadan sonra çarpanı korur)\nStok düzenli yenilenir. Şu an 🪙 **640 jetonun** var.',
           'La **boutique** vend 5 objets :\n🛡️ **Streak Shield** · 120 pièces (protège un jour manqué)\n⚡ **XP Booster** · 180 pièces (XP ×2 pendant 20 min)\n🎲 **Reroll Token** · 90 pièces (change une quête)\n💎 **Rare Drop** · 250 pièces (cosmétique premium aléatoire)\n🔥 **Combo Saver** · 160 pièces (garde le multiplicateur après une erreur)\nLe stock tourne régulièrement. Tu as 🪙 **640 pièces**.',
           'Der **Perk-Shop** verkauft 5 Items:\n🛡️ **Streak Shield** · 120 Münzen (schützt einen verpassten Tag)\n⚡ **XP Booster** · 180 Münzen (2× XP für 20 Minuten)\n🎲 **Reroll Token** · 90 Münzen (tauscht eine Tagesquest)\n💎 **Rare Drop** · 250 Münzen (zufälliges Premium-Cosmetic)\n🔥 **Combo Saver** · 160 Münzen (Multiplikator nach einem Fehler behalten)\nDas Angebot wechselt regelmäßig. Du hast aktuell 🪙 **640 Münzen**.'),
      go: ['perks'], rel: ['coins', 'streak', 'xp'] },

    { id: 'coins', t: T('Coins & wallet', 'Jeton ve cüzdan', 'Pièces et portefeuille', 'Münzen & Wallet'),
      k: ['coin', 'coins', 'wallet', 'money', 'currency', 'earn coins', 'spend', 'balance', 'jeton', 'jetonlar', 'cuzdan', 'para', 'bakiye', 'pieces', 'piece', 'portefeuille', 'argent', 'munzen', 'munze', 'geld'],
      a: T('🪙 **Coins** are the in-game currency. You have **640 coins** in your **Wallet**. Earn them from **quests, high scores, streak milestones and special events**, and spend them in the Perk shop (items cost 90–250 coins). **Risk It** also pays in coins.',
           '🪙 **Jetonlar** oyun içi para birimi. **Cüzdanında 640 jeton** var. **Görevlerden, yüksek skorlardan, seri kilometre taşlarından ve özel etkinliklerden** kazanır, Avantaj mağazasında harcarsın (ürünler 90–250 jeton). **Risk It** de jetonla ödüllendirir.',
           '🪙 Les **pièces** sont la monnaie du jeu. Tu as **640 pièces** dans ton **Portefeuille**. Gagne-les via les **quêtes, hauts scores, paliers de série et événements**, et dépense-les dans la boutique (90–250 pièces). **Risk It** paie aussi en pièces.',
           '🪙 **Münzen** sind die Spielwährung. In deinem **Wallet** liegen **640 Münzen**. Du verdienst sie durch **Quests, Highscores, Serien-Meilensteine und Events** und gibst sie im Perk-Shop aus (90–250 Münzen). **Risk It** zahlt ebenfalls in Münzen.'),
      go: ['perks'], rel: ['shop', 'quests', 'risk'] },

    { id: 'xp', t: T('XP & levels', 'XP ve seviyeler', 'XP et niveaux', 'XP & Level'),
      k: ['xp', 'level', 'levels', 'level up', 'experience', 'progress', 'explorer', 'level 7', 'level 8', 'earn xp', 'next unlock', 'mystery profile aura', 'aura', 'seviye', 'seviyeler', 'deneyim', 'ilerleme', 'kasif', 'niveau', 'niveaux', 'progression', 'explorateur', 'stufe', 'fortschritt', 'entdecker'],
      w: 1.1,
      a: T('You’re **Level 7 · Explorer** with **2,340 XP**. You need **660 XP** to reach **Level 8** (the ring shows 78%), which unlocks the **Mystery Profile Aura**, a cosmetic reward. Earn XP from every game (Boss Battle pays **+180**), from the Neon Vault mission (**+120**), from quests, and faster with **Double XP Hour** or an **XP Booster**.',
           '**7. Seviye · Kâşif**’sin ve **2.340 XP**’n var. **8. seviyeye** **660 XP** kaldı (halka %78’i gösteriyor); bu seviye **Mystery Profile Aura** kozmetik ödülünü açar. XP’yi her oyundan (Boss Battle **+180**), Neon Vault görevinden (**+120**), görevlerden ve **Çift XP Saati** veya **XP Booster** ile daha hızlı kazanırsın.',
           'Tu es **niveau 7 · Explorateur** avec **2 340 XP**. Il te faut **660 XP** pour le **niveau 8** (l’anneau indique 78 %), qui débloque l’**aura de profil mystère**, une récompense cosmétique. Gagne des XP à chaque jeu (Boss Battle **+180**), via Neon Vault (**+120**), les quêtes, et plus vite avec l’**Heure XP double** ou un **XP Booster**.',
           'Du bist **Level 7 · Explorer** mit **2.340 XP**. Bis **Level 8** fehlen **660 XP** (der Ring zeigt 78 %), das die **Mystery Profile Aura** freischaltet, eine kosmetische Belohnung. XP gibt es für jedes Spiel (Boss Battle **+180**), für Neon Vault (**+120**), Quests und schneller mit der **Double-XP-Stunde** oder einem **XP Booster**.'),
      go: ['perks'], rel: ['boost', 'event', 'shop'] },

    { id: 'boost', t: T('Boosts & perks', 'Boost\'lar', 'Boosts', 'Boosts'),
      k: ['boost', 'boosts', 'double xp booster', 'multiplier boost', 'power up', 'powerup'],
      w: 0.6,
      a: T('Boosts live in the **Perk shop**: **XP Booster** (2× XP for 20 min, 180 coins), **Streak Shield** (120), **Combo Saver** (160) and **Reroll Token** (90). For free double XP, watch for the **Double XP Hour** event on Home.',
           'Boost’lar **Avantaj mağazasında**: **XP Booster** (20 dk 2× XP, 180 jeton), **Streak Shield** (120), **Combo Saver** (160) ve **Reroll Token** (90). Bedava çift XP için Ana Sayfa’daki **Çift XP Saati** etkinliğini kaçırma.',
           'Les boosts sont dans la **boutique** : **XP Booster** (XP ×2 pendant 20 min, 180 pièces), **Streak Shield** (120), **Combo Saver** (160) et **Reroll Token** (90). Pour du double XP gratuit, guette l’**Heure XP double** sur Accueil.',
           'Boosts gibt es im **Perk-Shop**: **XP Booster** (2× XP für 20 Min., 180 Münzen), **Streak Shield** (120), **Combo Saver** (160) und **Reroll Token** (90). Kostenlose doppelte XP gibt es beim Event **Double-XP-Stunde** auf Start.'),
      go: ['perks'], rel: ['shop', 'event', 'xp'] },

    { id: 'streak', t: T('Streaks', 'Seriler', 'Séries', 'Serien'),
      k: ['streak', 'streaks', 'protect streak', 'days in a row', 'seri', 'seriler', 'seriyi', 'gun', 'serie', 'series', 'jours', 'serie halten', 'tage'],
      a: T('🔥 You’re on a **4-day streak**. Keep it going by playing every day; streak milestones even pay out coins. A **Streak Shield** (120 coins) protects one missed day, and the Watch tab has a video called “How top players protect a streak”.',
           '🔥 **4 günlük bir serin** var. Her gün oynayarak sürdür; seri kilometre taşları jeton bile verir. **Streak Shield** (120 jeton) kaçırılan bir günü korur; İzle sekmesinde “How top players protect a streak” videosu var.',
           '🔥 Tu es sur une **série de 4 jours**. Joue chaque jour pour la garder ; les paliers rapportent même des pièces. Un **Streak Shield** (120 pièces) protège un jour manqué, et Regarder a la vidéo « How top players protect a streak ».',
           '🔥 Du hast eine **4-Tage-Serie**. Spiele täglich, um sie zu halten; Serien-Meilensteine zahlen sogar Münzen aus. Ein **Streak Shield** (120 Münzen) schützt einen verpassten Tag, und bei Ansehen gibt es das Video „How top players protect a streak“.'),
      go: ['perks', 'watch'], rel: ['shop', 'quests', 'videos'] },

    { id: 'combo', t: T('Combos', 'Kombolar', 'Combos', 'Combos'),
      k: ['combo', 'combos', 'multiplier', 'kombo', 'kombolar', 'carpan', 'combo'],
      w: 0.9,
      a: T('A **combo** is a run of consecutive good answers that raises your multiplier. Combos matter in **Rapid Fire**, **Perfect Run** (one mistake resets it) and the quest **Combo Keeper** (reach 5×). The **Combo Saver** perk keeps it alive after one slip, and Watch has “3 tricks for a higher combo”.',
           '**Kombo**, çarpanını yükselten ardışık doğru cevaplar zinciri. **Rapid Fire**, **Perfect Run** (tek hata sıfırlar) ve **Combo Keeper** görevinde (5×’e ulaş) önemli. **Combo Saver** avantajı bir hatadan sonra onu korur; İzle’de “3 tricks for a higher combo” videosu var.',
           'Un **combo** est une série de bonnes réponses qui augmente ton multiplicateur. Il compte dans **Rapid Fire**, **Perfect Run** (une erreur le remet à zéro) et la quête **Combo Keeper** (atteindre 5×). Le perk **Combo Saver** le garde après une erreur, et Regarder a « 3 tricks for a higher combo ».',
           'Eine **Combo** ist eine Serie richtiger Antworten, die deinen Multiplikator erhöht. Sie zählt bei **Rapid Fire**, **Perfect Run** (ein Fehler setzt sie zurück) und der Quest **Combo Keeper** (5× erreichen). Der **Combo Saver** rettet sie nach einem Patzer, und bei Ansehen gibt es „3 tricks for a higher combo“.'),
      go: ['play'], rel: ['perfect', 'rapid', 'shop'] },

    /* ---------- Uzio AI ---------- */
    { id: 'uzioai', t: T('Uzio AI tab', 'Uzio AI sekmesi', 'Onglet Uzio AI', 'Uzio-AI-Tab'),
      k: ['uzio ai', 'ai', 'game master', 'remix', 'create a boss', 'build a quest', 'balance it', 'artificial intelligence', 'yapay zeka', 'oyun ustasi', 'ia', 'maitre du jeu', 'intelligence artificielle', 'ki', 'spielleiter', 'kunstliche intelligenz'],
      a: T('The **Uzio AI** tab is your game master. It can **invent a challenge**, **remix** two modes, set a **handicap**, **create a boss** with escalating rules, **build a quest** from several games, and **balance** a challenge so it feels fair but exciting. There are quick prompts like “Give me a 2-minute challenge with a huge combo bonus”, plus a **Live modifier** card.',
           '**Uzio AI** sekmesi oyun ustan. **Meydan okuma icat edebilir**, iki modu **birleştirebilir**, **handikap** koyabilir, giderek zorlaşan bir **boss yaratabilir**, birkaç oyundan **görev zinciri kurabilir** ve bir meydan okumayı adil ama heyecanlı olacak şekilde **dengeleyebilir**. “2 dakikalık, dev kombo bonuslu bir meydan okuma ver” gibi hızlı komutlar ve bir **Canlı değiştirici** kartı var.',
           'L’onglet **Uzio AI** est ton maître du jeu. Il peut **inventer un défi**, **remixer** deux modes, fixer un **handicap**, **créer un boss** aux règles croissantes, **construire une quête** à partir de plusieurs jeux et **équilibrer** un défi. Il y a des prompts rapides comme « Donne-moi un défi de 2 minutes avec un gros bonus de combo » et une carte **Live modifier**.',
           'Der **Uzio-AI**-Tab ist dein Spielleiter. Er kann **Challenges erfinden**, zwei Modi **remixen**, ein **Handicap** setzen, einen **Boss** mit steigenden Regeln erschaffen, eine **Quest** aus mehreren Spielen **bauen** und Challenges **ausbalancieren**. Es gibt Quick Prompts wie „Gib mir eine 2-Minuten-Challenge mit riesigem Combo-Bonus“ und eine **Live-Modifier**-Karte.'),
      go: ['uzio-ai'], rel: ['challenge', 'modifier', 'boss'] },

    { id: 'modifier', t: T('Live modifier', 'Canlı değiştirici', 'Live modifier', 'Live-Modifier'),
      k: ['live modifier', 'modifier', 'difficulty', 'spicy', 'handicap', 'harder', 'easier', 'timer', 'fewer hints', 'faster timer', 'zorluk', 'degistirici', 'aci', 'difficulte', 'epice', 'modificateur', 'schwierigkeit', 'scharf', 'modifikator'],
      w: 0.9,
      a: T('The **Live modifier** card on the Uzio AI tab shows **Difficulty: Spicy 🌶️** with three tweaks active: **+25% XP**, **Fewer hints** and a **Faster timer**. Uzio is ready to adjust timers, hints, multipliers and rewards while you play.',
           'Uzio AI sekmesindeki **Canlı değiştirici** kartı **Zorluk: Acılı 🌶️** gösterir ve üç ayar aktiftir: **+%25 XP**, **Daha az ipucu** ve **Daha hızlı zamanlayıcı**. Uzio, sen oynarken zamanlayıcıları, ipuçlarını, çarpanları ve ödülleri ayarlamaya hazır.',
           'La carte **Live modifier** de l’onglet Uzio AI affiche **Difficulté : Épicée 🌶️** avec trois réglages actifs : **+25 % XP**, **Moins d’indices** et un **Minuteur plus rapide**. Uzio ajuste minuteurs, indices, multiplicateurs et récompenses pendant que tu joues.',
           'Die **Live-Modifier**-Karte im Uzio-AI-Tab zeigt **Schwierigkeit: Scharf 🌶️** mit drei aktiven Anpassungen: **+25 % XP**, **Weniger Hinweise** und **Schnellerer Timer**. Uzio passt Timer, Hinweise, Multiplikatoren und Belohnungen an, während du spielst.'),
      go: ['uzio-ai'], rel: ['uzioai', 'challenge', 'xp'] },

    { id: 'challenge', t: T('Give me a challenge', 'Bana meydan okuma ver', 'Donne-moi un défi', 'Gib mir eine Challenge'),
      k: ['challenge', 'challenge me', 'give me a challenge', 'generate', 'invent', 'create a challenge', 'make a challenge', 'dare', 'surprise me with', 'meydan okuma', 'meydan oku', 'uret', 'olustur', 'ver bana', 'defi', 'defis', 'genere', 'cree un defi', 'donne moi un defi', 'herausforderung', 'challenge', 'erfinde', 'erzeuge', 'gib mir'],
      w: 1.15, dynamic: 'challenge', go: ['uzio-ai'], rel: ['uzioai', 'modifier', 'quests'] },

    /* ---------- profile, settings, meta ---------- */
    { id: 'onboarding', t: T('Welcome & profile', 'Karşılama ve profil', 'Accueil et profil', 'Willkommen & Profil'),
      k: ['onboarding', 'welcome', 'profile', 'play style', 'casual', 'competitive', 'hardcore', 'interests', 'replay welcome', 'skip', 'karsilama', 'profil', 'oyun tarzi', 'ilgi alanlari', 'accueil', 'profil', 'style de jeu', 'centres d interet', 'willkommen', 'profil', 'spielstil', 'interessen'],
      a: T('On your first visit Uzio asks three quick things: your **name**, your **play style** (🌱 **Casual** – quick and easy-to-enter, 🚀 **Competitive** – scores, streaks and harder goals, 🏆 **Hardcore** – tough rules, high stakes, rare rewards) and up to **3 interests** (Speed, Puzzles, Competition, Bosses, Quests, Rewards, Streaks, AI, High Scores). Uzio uses them to tailor your picks. You can skip it, and redo it any time via **Replay welcome** in the account menu.',
           'İlk ziyaretinde Uzio üç şey sorar: **adın**, **oyun tarzın** (🌱 **Rahat** – hızlı ve kolay girişli, 🚀 **Rekabetçi** – skorlar, seriler, zor hedefler, 🏆 **Hardcore** – sert kurallar, yüksek risk, nadir ödüller) ve en fazla **3 ilgi alanı** (Speed, Puzzles, Competition, Bosses, Quests, Rewards, Streaks, AI, High Scores). Uzio önerilerini buna göre kurar. Atlayabilir ve hesap menüsündeki **Karşılama ekranını yeniden göster** ile istediğin zaman tekrarlayabilirsin.',
           'À ta première visite, Uzio te pose trois questions : ton **prénom**, ton **style de jeu** (🌱 **Décontracté**, 🚀 **Compétitif**, 🏆 **Hardcore**) et jusqu’à **3 centres d’intérêt** (Speed, Puzzles, Competition, Bosses, Quests, Rewards, Streaks, AI, High Scores). Il adapte ses suggestions. Tu peux passer, et refaire cela via **Revoir l’accueil** dans le menu du compte.',
           'Beim ersten Besuch fragt Uzio drei Dinge: deinen **Namen**, deinen **Spielstil** (🌱 **Entspannt**, 🚀 **Kompetitiv**, 🏆 **Hardcore**) und bis zu **3 Interessen** (Speed, Puzzles, Competition, Bosses, Quests, Rewards, Streaks, AI, High Scores). Damit passt Uzio seine Vorschläge an. Du kannst überspringen und es jederzeit über **Begrüßung wiederholen** im Kontomenü wiederholen.'),
      go: ['home'], rel: ['me', 'menu', 'privacy'] },

    { id: 'me', t: T('About me', 'Benim bilgilerim', 'Mon profil', 'Mein Profil'),
      k: ['my name', 'who am i', 'my profile', 'my level', 'my stats', 'my xp', 'about me', 'what do you know about me', 'do you know me', 'my streak', 'my coins', 'adim ne', 'ben kimim', 'benim', 'seviyem', 'istatistik', 'mon nom', 'qui suis je', 'mon niveau', 'mes stats', 'mein name', 'wer bin ich', 'mein level', 'meine stats'],
      w: 1.2, dynamic: 'me', go: ['perks'], rel: ['xp', 'onboarding', 'privacy'] },

    { id: 'menu', t: T('Account menu', 'Hesap menüsü', 'Menu du compte', 'Kontomenü'),
      k: ['account', 'settings', 'my plan', 'plan', 'account menu', 'hamburger', 'menu', 'profile menu', 'hesap', 'ayarlar', 'planim', 'menu', 'compte', 'reglages', 'mon programme', 'konto', 'einstellungen', 'mein plan', 'kontomenu'],
      a: T('The **account menu** (the ☰ button, top right) shows your avatar, name and level, then **Account**, **Settings** and **My Plan** (those three currently say “coming soon”), **Replay welcome**, the **Language** picker and the **Dark mode** switch.',
           '**Hesap menüsü** (sağ üstteki ☰ düğmesi) avatarını, adını ve seviyeni; ardından **Hesap**, **Ayarlar** ve **Planım** (bu üçü şu an “yakında” der), **Karşılama ekranını yeniden göster**, **Dil** seçici ve **Karanlık mod** anahtarını gösterir.',
           'Le **menu du compte** (bouton ☰ en haut à droite) affiche ton avatar, ton nom et ton niveau, puis **Compte**, **Réglages** et **Mon programme** (affichent pour l’instant « bientôt »), **Revoir l’accueil**, le sélecteur de **langue** et le **mode sombre**.',
           'Das **Kontomenü** (☰ oben rechts) zeigt Avatar, Name und Level, dann **Konto**, **Einstellungen** und **Mein Plan** (diese drei zeigen aktuell „coming soon“), **Begrüßung wiederholen**, die **Sprachauswahl** und den **Dunkelmodus**-Schalter.'),
      go: ['home'], rel: ['languages', 'theme', 'onboarding'] },

    { id: 'languages', t: T('Languages', 'Diller', 'Langues', 'Sprachen'),
      k: ['language', 'languages', 'translate', 'english', 'turkish', 'french', 'german', 'turkce', 'francais', 'deutsch', 'dil', 'diller', 'cevir', 'ingilizce', 'turkce', 'fransizca', 'almanca', 'langue', 'langues', 'traduire', 'anglais', 'turc', 'francais', 'allemand', 'sprache', 'sprachen', 'ubersetzen', 'englisch', 'turkisch', 'franzosisch'],
      a: T('Uzio speaks **4 languages**: 🇬🇧 **English**, 🇹🇷 **Türkçe**, 🇫🇷 **Français** and 🇩🇪 **Deutsch**. Switch in the account menu (Language) on the game hub, or with the **EN** button on the landing page. Your choice is remembered, and I answer in the same language, so you can talk to me in any of the four.',
           'Uzio **4 dil** konuşur: 🇬🇧 **English**, 🇹🇷 **Türkçe**, 🇫🇷 **Français**, 🇩🇪 **Deutsch**. Oyun merkezinde hesap menüsünden (Dil), açılış sayfasında **EN** düğmesinden değiştir. Seçimin hatırlanır ve ben de aynı dilde cevap veririm; dört dilden birinde yazabilirsin.',
           'Uzio parle **4 langues** : 🇬🇧 **English**, 🇹🇷 **Türkçe**, 🇫🇷 **Français**, 🇩🇪 **Deutsch**. Change dans le menu du compte (Langue) sur le hub, ou avec le bouton **EN** sur la page d’arrivée. Ton choix est mémorisé et je réponds dans la même langue.',
           'Uzio spricht **4 Sprachen**: 🇬🇧 **English**, 🇹🇷 **Türkçe**, 🇫🇷 **Français**, 🇩🇪 **Deutsch**. Wechsle im Kontomenü (Sprache) im Hub oder mit dem **EN**-Button auf der Startseite. Deine Wahl wird gespeichert, und ich antworte in derselben Sprache.'),
      go: ['home'], rel: ['menu', 'theme', 'privacy'] },

    { id: 'theme', t: T('Dark mode', 'Karanlık mod', 'Mode sombre', 'Dunkelmodus'),
      k: ['dark mode', 'dark', 'light mode', 'light', 'theme', 'night', 'day', 'appearance', 'karanlik', 'karanlik mod', 'tema', 'gece', 'aydinlik', 'sombre', 'theme', 'nuit', 'mode clair', 'dunkel', 'dunkelmodus', 'hell', 'design'],
      a: T('Use the **Dark mode** switch in the account menu (a little sun/moon toggle), or the **Dark mode** item in the ☰ menu on the landing page. It’s saved in your browser, and if you never choose, Uzio follows your device’s setting.',
           'Hesap menüsündeki **Karanlık mod** anahtarını (küçük güneş/ay düğmesi) ya da açılış sayfasında ☰ menüsündeki **Karanlık mod**’u kullan. Tarayıcında saklanır; hiç seçmezsen Uzio cihazının ayarını izler.',
           'Utilise l’interrupteur **Mode sombre** du menu du compte (petit soleil/lune), ou l’entrée **Mode sombre** du menu ☰ sur la page d’arrivée. C’est mémorisé dans ton navigateur, et sans choix, Uzio suit le réglage de ton appareil.',
           'Nutze den **Dunkelmodus**-Schalter im Kontomenü (kleiner Sonne/Mond-Toggle) oder den Eintrag **Dunkelmodus** im ☰-Menü der Startseite. Er wird im Browser gespeichert; ohne Auswahl folgt Uzio deiner Geräteeinstellung.'),
      go: ['home'], rel: ['menu', 'languages', 'privacy'] },

    { id: 'search', t: T('Search', 'Arama', 'Recherche', 'Suche'),
      k: ['search', 'find', 'look for', 'search bar', 'magnifier', 'ara', 'arama', 'bul', 'recherche', 'chercher', 'trouver', 'suche', 'suchen', 'finden'],
      a: T('The **Search** pill in the top bar looks through the cards on the tab you’re viewing: type a word, press Enter, and the first matching card is scrolled into view and highlighted. If nothing matches you’ll see “No results found”. For anything else, just ask me!',
           'Üst çubuktaki **Arama** kapsülü, bulunduğun sekmedeki kartlarda arar: bir kelime yaz, Enter’a bas; ilk eşleşen kart görünüme kaydırılır ve vurgulanır. Eşleşme yoksa “Sonuç bulunamadı” görürsün. Başka her şey için bana sorabilirsin!',
           'La pilule **Recherche** de la barre du haut parcourt les cartes de l’onglet affiché : tape un mot, appuie sur Entrée, et la première carte correspondante est mise en évidence. Sinon tu verras « Aucun résultat ». Pour le reste, demande-moi !',
           'Die **Suche** in der oberen Leiste durchsucht die Karten des aktuellen Tabs: Wort eintippen, Enter drücken, und die erste passende Karte wird hervorgehoben. Ohne Treffer erscheint „Kein Ergebnis gefunden“. Für alles andere frag mich!'),
      go: ['home'], rel: ['tabs', 'menu', 'can'] },

    { id: 'orb', t: T('The orb', 'Küre', 'L’orbe', 'Die Kugel'),
      k: ['orb', 'sphere', 'ball', 'bubble', 'character', 'mascot', 'kure', 'top', 'karakter', 'orbe', 'sphere', 'personnage', 'kugel', 'figur', 'maskottchen'],
      a: T('That’s me! 🔮 The **orb** is Uzio’s character, a glowing, colour-shifting sphere that floats in the corner and looks around. It’s drawn live with WebGL (no images or libraries). Click it any time to chat with me; on the landing page it’s the big one in the middle.',
           'O benim! 🔮 **Küre**, Uzio’nun karakteri: köşede süzülen, renk değiştiren, etrafa bakan parlak bir küre. WebGL ile canlı çizilir (resim veya kütüphane yok). İstediğin zaman tıklayıp benimle sohbet et; açılış sayfasında ortadaki büyük küre o.',
           'C’est moi ! 🔮 L’**orbe** est le personnage d’Uzio, une sphère lumineuse qui change de couleur et flotte dans le coin. Elle est dessinée en direct avec WebGL (sans images ni bibliothèques). Clique dessus pour discuter avec moi ; sur la page d’arrivée, c’est la grande au milieu.',
           'Das bin ich! 🔮 Die **Kugel** ist Uzios Figur, eine leuchtende, farbwechselnde Sphäre, die in der Ecke schwebt. Sie wird live mit WebGL gezeichnet (keine Bilder, keine Bibliotheken). Klick sie jederzeit an, um mit mir zu chatten; auf der Startseite ist es die große in der Mitte.'),
      go: ['uzio-ai'], rel: ['about', 'tech', 'can'] },

    { id: 'privacy', t: T('Privacy & saved data', 'Gizlilik ve veriler', 'Confidentialité', 'Datenschutz'),
      k: ['privacy', 'profile saved', 'where is my data', 'data', 'saved', 'save', 'remember', 'storage', 'cookies', 'localstorage', 'tracking', 'safe', 'gizlilik', 'veri', 'kaydet', 'hatirla', 'cerez', 'guvenli', 'confidentialite', 'donnees', 'sauvegarde', 'cookies', 'datenschutz', 'daten', 'speichern', 'sicher'],
      a: T('Everything is stored **only in your own browser** (local storage): your name, play style and interests, your language and your light/dark choice. There’s no sign-in and nothing is sent to a server, and that includes this chat: I run entirely in your browser too.',
           'Her şey **yalnızca kendi tarayıcında** (yerel depolama) saklanır: adın, oyun tarzın ve ilgi alanların, dilin ve açık/koyu seçimin. Giriş yok ve hiçbir şey sunucuya gönderilmez; bu sohbet de dahil: ben de tamamen tarayıcında çalışırım.',
           'Tout est stocké **uniquement dans ton navigateur** (stockage local) : ton prénom, ton style de jeu et centres d’intérêt, ta langue et ton choix clair/sombre. Pas de connexion et rien n’est envoyé à un serveur, y compris ce chat : je tourne aussi dans ton navigateur.',
           'Alles wird **nur in deinem eigenen Browser** (Local Storage) gespeichert: Name, Spielstil und Interessen, Sprache und Hell/Dunkel-Wahl. Es gibt keine Anmeldung und nichts geht an einen Server – auch dieser Chat nicht: Ich laufe komplett in deinem Browser.'),
      go: [], rel: ['onboarding', 'theme', 'languages'] },

    { id: 'demo', t: T('Is it playable yet?', 'Oynanabilir mi?', 'Est-ce jouable ?', 'Schon spielbar?'),
      k: ['playable', 'real', 'work', 'working', 'coming soon', 'ready to connect', 'demo', 'prototype', 'beta', 'live', 'actually play', 'can i actually', 'oynanabilir', 'gercek', 'yakinda', 'calisiyor mu', 'prototip', 'jouable', 'reel', 'bientot', 'prototype', 'spielbar', 'echt', 'bald', 'funktioniert'],
      a: T('Honest answer: the site is currently a **front-end preview**. Tabs, search, languages, dark mode, the welcome flow and this chat all work, but the games themselves aren’t wired up yet: tapping a game card shows “activity ready to connect”, and numbers like XP, coins and streak are sample values. Account, Settings and My Plan say “coming soon”.',
           'Dürüst cevap: site şu an bir **ön yüz önizlemesi**. Sekmeler, arama, diller, karanlık mod, karşılama akışı ve bu sohbet çalışıyor; ama oyunların kendisi henüz bağlı değil: bir oyun kartına dokununca “activity ready to connect” görürsün, XP, jeton ve seri gibi sayılar örnek değerler. Hesap, Ayarlar ve Planım “yakında” der.',
           'Réponse honnête : le site est pour l’instant un **aperçu front-end**. Onglets, recherche, langues, mode sombre, accueil et ce chat fonctionnent, mais les jeux ne sont pas encore branchés : toucher une carte affiche « activity ready to connect », et XP, pièces et série sont des valeurs d’exemple. Compte, Réglages et Mon programme affichent « bientôt ».',
           'Ehrliche Antwort: Die Seite ist aktuell eine **Front-End-Vorschau**. Tabs, Suche, Sprachen, Dunkelmodus, der Willkommensablauf und dieser Chat funktionieren, aber die Spiele sind noch nicht angebunden: Ein Tipp auf eine Spielkarte zeigt „activity ready to connect“, und XP, Münzen und Serie sind Beispielwerte. Konto, Einstellungen und Mein Plan zeigen „coming soon“.'),
      go: [], rel: ['can', 'about', 'tech'] },

    { id: 'pricing', t: T('Pricing & plans', 'Fiyat ve planlar', 'Tarifs', 'Preise & Pläne'),
      k: ['is it free', 'free', 'pricing', 'subscription', 'premium', 'paid', 'pay', 'sign up', 'sign in', 'login', 'register', 'ucretsiz', 'ucret', 'abonelik', 'uyelik', 'giris', 'kayit', 'gratuit', 'tarif', 'abonnement', 'connexion', 'inscription', 'kostenlos', 'abo', 'anmelden', 'registrieren', 'bezahlen'],
      w: 0.9,
      a: T('The site doesn’t list any pricing, subscription or sign-in right now. “My Plan” in the account menu is marked **coming soon**. The only “prices” you’ll find are the in-game **coin** costs in the Perk shop (90–250 coins).',
           'Site şu an herhangi bir fiyat, abonelik veya giriş sunmuyor. Hesap menüsündeki “Planım” **yakında** olarak işaretli. Bulacağın tek “fiyat”, Avantaj mağazasındaki oyun içi **jeton** bedelleri (90–250 jeton).',
           'Le site n’affiche pour l’instant ni tarif, ni abonnement, ni connexion. « Mon programme » dans le menu est marqué **bientôt**. Les seuls « prix » sont les coûts en **pièces** de la boutique (90–250 pièces).',
           'Die Seite zeigt aktuell weder Preise noch Abos oder Anmeldung. „Mein Plan“ im Kontomenü ist als **coming soon** markiert. Die einzigen „Preise“ sind die **Münzen**-Kosten im Perk-Shop (90–250 Münzen).'),
      go: ['perks'], rel: ['shop', 'menu', 'demo'] },

    { id: 'tech', t: T('How is it built?', 'Nasıl yapıldı?', 'Comment est-ce fait ?', 'Wie ist es gebaut?'),
      k: ['built', 'website built', 'site built', 'how is it made', 'how was it made', 'made with', 'technology', 'tech', 'stack', 'code', 'html', 'javascript', 'webgl', 'github', 'open source', 'framework', 'library', 'yapildi', 'teknoloji', 'kod', 'kutuphane', 'construit', 'technologie', 'code', 'bibliotheque', 'gebaut', 'technik', 'bibliothek', 'programmiert'],
      a: T('It’s a lightweight static site: plain **HTML, CSS and JavaScript** with no framework or libraries. Two entry points (`index.html` landing and `main-page.html` hub), an iOS-style glass interface with light/dark themes, four-language support, and the orb is a hand-written **WebGL shader**. This chat is plain JS too, with a built-in knowledge base.',
           'Hafif, statik bir site: framework veya kütüphane olmadan düz **HTML, CSS ve JavaScript**. İki giriş noktası (`index.html` açılış ve `main-page.html` merkez), açık/koyu temalı iOS tarzı cam arayüz, dört dil desteği ve elle yazılmış bir **WebGL shader** olan küre. Bu sohbet de düz JS ve yerleşik bir bilgi tabanıyla çalışır.',
           'C’est un site statique léger : **HTML, CSS et JavaScript** purs, sans framework ni bibliothèque. Deux points d’entrée (`index.html` et `main-page.html`), une interface vitrée façon iOS en clair/sombre, quatre langues, et l’orbe est un **shader WebGL** écrit à la main. Ce chat est aussi du JS pur avec une base de connaissances intégrée.',
           'Eine schlanke statische Seite: reines **HTML, CSS und JavaScript** ohne Framework oder Bibliotheken. Zwei Einstiegspunkte (`index.html` und `main-page.html`), eine iOS-artige Glas-Oberfläche in Hell/Dunkel, vier Sprachen, und die Kugel ist ein handgeschriebener **WebGL-Shader**. Dieser Chat ist ebenfalls reines JS mit eingebauter Wissensbasis.'),
      go: [], rel: ['orb', 'demo', 'privacy'] },

    { id: 'backtop', t: T('Back to top', 'Başa dön', 'Retour en haut', 'Nach oben'),
      k: ['back to top', 'scroll', 'top button', 'basa don', 'kaydir', 'retour en haut', 'defiler', 'nach oben', 'scrollen'],
      a: T('When you scroll down a long tab, a **Back to top** button appears so you can jump straight back up.',
           'Uzun bir sekmede aşağı kaydırdığında, hemen yukarı dönmen için bir **Başa dön** düğmesi belirir.',
           'Quand tu descends dans un long onglet, un bouton **Retour en haut** apparaît pour remonter d’un coup.',
           'Wenn du in einem langen Tab nach unten scrollst, erscheint ein **Nach oben**-Button zum direkten Zurückspringen.'),
      go: [], rel: ['tabs', 'search', 'menu'] },

    /* ---------- small talk ---------- */
    { id: 'hello', t: T('Hello', 'Merhaba', 'Salut', 'Hallo'), max: 4, w: 2,
      k: ['hi', 'hello', 'hey', 'yo', 'hiya', 'good morning', 'good evening', 'sup', 'merhaba', 'selam', 'gunaydin', 'iyi aksamlar', 'slm', 'bonjour', 'salut', 'coucou', 'bonsoir', 'hallo', 'guten tag', 'moin', 'servus', 'guten morgen'],
      dynamic: 'hello', go: [], rel: ['can', 'challenge', 'perks'] },

    { id: 'how-are-you', t: T('How are you?', 'Nasılsın?', 'Comment vas-tu ?', 'Wie geht’s?'), max: 5, w: 2,
      k: ['how are you', 'how are you doing', 'whats up', 'how is it going', 'nasilsin', 'naber', 'ne haber', 'ca va', 'comment vas tu', 'comment ca va', 'wie gehts', 'wie geht es dir', 'wie gehts dir'],
      a: T('Doing great, my sparkle levels are at 100%! ✨ What do you want to play or know?',
           'Harikayım, parıltı seviyem %100! ✨ Ne oynamak ya da öğrenmek istersin?',
           'Au top, mon niveau de brillance est à 100 % ! ✨ Qu’as-tu envie de jouer ou de savoir ?',
           'Mir geht’s super, mein Glitzerlevel liegt bei 100 %! ✨ Was möchtest du spielen oder wissen?'),
      go: [], rel: ['challenge', 'modes', 'can'] },

    { id: 'thanks', t: T('Thanks', 'Teşekkürler', 'Merci', 'Danke'), max: 5, w: 2,
      k: ['thanks', 'thank you', 'thx', 'ty', 'cheers', 'great', 'awesome', 'cool', 'nice', 'perfect', 'tesekkurler', 'tesekkur ederim', 'sagol', 'harika', 'super', 'merci', 'genial', 'parfait', 'danke', 'dankeschon', 'toll', 'prima'],
      a: T('Anytime! 🎮 Want me to cook up a challenge, or is there something else you’d like to know?',
           'Rica ederim! 🎮 Sana bir meydan okuma hazırlayayım mı, yoksa başka bir şey mi öğrenmek istersin?',
           'Avec plaisir ! 🎮 Je te prépare un défi, ou tu veux savoir autre chose ?',
           'Gern geschehen! 🎮 Soll ich dir eine Challenge zaubern, oder möchtest du noch etwas wissen?'),
      go: [], rel: ['challenge', 'modes', 'shop'] },

    { id: 'bye', t: T('Bye', 'Hoşça kal', 'Au revoir', 'Tschüss'), max: 4, w: 2,
      k: ['bye', 'goodbye', 'see you', 'later', 'cya', 'gule gule', 'hosca kal', 'gorusuruz', 'au revoir', 'a plus', 'a bientot', 'tschuss', 'auf wiedersehen', 'bis bald', 'ciao'],
      a: T('See you later! Keep that streak alive. 🔥', 'Görüşürüz! Serini sakın bozma. 🔥', 'À bientôt ! Garde ta série. 🔥', 'Bis später! Halte deine Serie am Leben. 🔥'),
      go: [], rel: [] },

    { id: 'joke', t: T('Tell me a joke', 'Şaka yap', 'Raconte une blague', 'Erzähl einen Witz'),
      k: ['joke', 'funny', 'make me laugh', 'saka', 'komik', 'guldur', 'blague', 'drole', 'rire', 'witz', 'lustig', 'lachen'],
      a: T('Why did the player bring a ladder to the boss fight? Because the combo was **sky-high**. 🪜', 'Oyuncu boss savaşına neden merdiven getirdi? Çünkü kombo **göklerdeydi**. 🪜', 'Pourquoi le joueur a-t-il apporté une échelle au combat de boss ? Parce que le combo était **au plafond**. 🪜', 'Warum brachte der Spieler eine Leiter zum Bosskampf mit? Weil die Combo **himmelhoch** war. 🪜'),
      go: [], rel: ['boss', 'combo', 'challenge'] }
  ];

  var BY_ID = {};
  KB.forEach(function (e) { e.k = e.k.filter(function (k, i, a) { return a.indexOf(k) === i; }); BY_ID[e.id] = e; });

  /* ======================================================================
     PART 1b · ENGINE
     ====================================================================== */
  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/ı/g, 'i').replace(/ß/g, 'ss').replace(/æ/g, 'ae').replace(/œ/g, 'oe')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/['’`]/g, ' ').replace(/[^a-z0-9+]+/g, ' ').trim();
  }
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length, i, j, prev = [], cur;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur = [i];
      for (j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function parse(text) {
    var n = norm(text), tok = n ? n.split(' ') : [];
    return { raw: text, text: ' ' + n + ' ', tok: tok };
  }
  function kwScore(kw, q) {
    if (kw.indexOf(' ') > -1) return q.text.indexOf(' ' + kw) > -1 ? kw.split(' ').length * 2.2 : 0;
    var best = 0;
    for (var i = 0; i < q.tok.length; i++) {
      var t = q.tok[i];
      if (t === kw) { best = 2; break; }
      if (kw.length >= 4 && t.indexOf(kw) === 0 && t.length - kw.length <= 3) best = Math.max(best, 1.7);
      else if (t.length >= 5 && kw.length >= 5 && Math.abs(t.length - kw.length) <= 1 && lev(t, kw) <= 1) best = Math.max(best, 1.3);
    }
    return best;
  }
  function scoreEntry(e, q) {
    if (e.max && q.tok.length > e.max) return 0;
    var s = 0;
    for (var i = 0; i < e.k.length; i++) s += kwScore(e.k[i], q);
    return s * (e.w || 1);
  }

  var MORE_RE = /^(more|tell me more|go on|continue|details|elaborate|and|what else|daha fazla|devam|baska|plus|encore|et alors|mehr|weiter|noch mehr)( |$)/;

  var PROFILE_LEVEL = {
    start: T('Casual', 'Rahat', 'Décontracté', 'Entspannt'),
    grow: T('Competitive', 'Rekabetçi', 'Compétitif', 'Kompetitiv'),
    conf: T('Hardcore', 'Hardcore', 'Hardcore', 'Hardcore')
  };

  var UI = {
    en: { title: 'Uzio AI', sub: 'Knows everything about Uzio', ph: 'Ask me anything about Uzio…', send: 'Send', close: 'Close', reset: 'New chat', open: 'Open Uzio AI',
          thinking: 'Uzio is typing',
          fallback: 'I only know Uzio, and I couldn’t find that on the site. Here are things I can help with:',
          greetNamed: 'Hey {n}! 👋 I’m Uzio. I know every corner of this site, and I can invent challenges for you. What are you curious about?',
          greet: 'Hey! 👋 I’m Uzio. I know every corner of this site, and I can invent challenges for you. What are you curious about?',
          more: 'Here’s where we can go next:', related: 'You might also like:' },
    tr: { title: 'Uzio AI', sub: 'Uzio hakkında her şeyi bilir', ph: 'Uzio hakkında her şeyi sor…', send: 'Gönder', close: 'Kapat', reset: 'Yeni sohbet', open: 'Uzio AI’ı aç',
          thinking: 'Uzio yazıyor',
          fallback: 'Ben sadece Uzio’yu biliyorum ve bunu sitede bulamadım. Şunlarda yardımcı olabilirim:',
          greetNamed: 'Selam {n}! 👋 Ben Uzio. Bu sitenin her köşesini biliyorum ve senin için meydan okumalar icat edebilirim. Neyi merak ediyorsun?',
          greet: 'Selam! 👋 Ben Uzio. Bu sitenin her köşesini biliyorum ve senin için meydan okumalar icat edebilirim. Neyi merak ediyorsun?',
          more: 'Şuradan devam edebiliriz:', related: 'Bunlar da ilgini çekebilir:' },
    fr: { title: 'Uzio AI', sub: 'Sait tout sur Uzio', ph: 'Demande-moi tout sur Uzio…', send: 'Envoyer', close: 'Fermer', reset: 'Nouveau chat', open: 'Ouvrir Uzio AI',
          thinking: 'Uzio écrit',
          fallback: 'Je ne connais qu’Uzio et je n’ai pas trouvé ça sur le site. Voici ce dont je peux parler :',
          greetNamed: 'Salut {n} ! 👋 Je suis Uzio. Je connais chaque recoin de ce site et je peux inventer des défis pour toi. Qu’est-ce qui te fait envie ?',
          greet: 'Salut ! 👋 Je suis Uzio. Je connais chaque recoin de ce site et je peux inventer des défis pour toi. Qu’est-ce qui te fait envie ?',
          more: 'Voici où on peut aller ensuite :', related: 'Ça pourrait aussi t’intéresser :' },
    de: { title: 'Uzio AI', sub: 'Weiß alles über Uzio', ph: 'Frag mich alles über Uzio…', send: 'Senden', close: 'Schließen', reset: 'Neuer Chat', open: 'Uzio AI öffnen',
          thinking: 'Uzio tippt',
          fallback: 'Ich kenne nur Uzio und habe das auf der Seite nicht gefunden. Dabei kann ich helfen:',
          greetNamed: 'Hey {n}! 👋 Ich bin Uzio. Ich kenne jede Ecke dieser Seite und kann Challenges für dich erfinden. Was interessiert dich?',
          greet: 'Hey! 👋 Ich bin Uzio. Ich kenne jede Ecke dieser Seite und kann Challenges für dich erfinden. Was interessiert dich?',
          more: 'Hier können wir weitermachen:', related: 'Das könnte dich auch interessieren:' }
  };

  /* ---------- challenge generator ---------- */
  var MODES = ['Rapid Fire', 'Boss Battle', 'Puzzle Drop', 'Perfect Run', 'Beat Uzio', 'Risk It', 'Quest Run'];
  var MODE_MIN = { 'Rapid Fire': [90, 's'], 'Boss Battle': [5, 'm'], 'Puzzle Drop': [3, 'm'], 'Perfect Run': [4, 'm'], 'Beat Uzio': [2, 'm'], 'Risk It': [3, 'm'], 'Quest Run': [7, 'm'] };
  var UNIT = { s: { en: 'sec', tr: 'sn', fr: 's', de: 'Sek.' }, m: { en: 'min', tr: 'dk', fr: 'min', de: 'Min.' } };
  var ADJ = ['Neon', 'Turbo', 'Shadow', 'Golden', 'Chaos', 'Velvet', 'Rogue', 'Hyper'];
  var NOUN = ['Gauntlet', 'Rush', 'Vault', 'Run', 'Showdown', 'Heist', 'Trial', 'Spiral'];
  var TWISTS = {
    en: ['Every correct answer shrinks the timer by 2 seconds.', 'No hints allowed, but your combo bonus doubles.', 'Miss once and the multiplier resets to 1×.', 'The final round is worth triple points.', 'Uzio steals 10 points for every slow answer.', 'Hit a 5× combo to unlock a bonus chest.'],
    tr: ['Her doğru cevap zamanlayıcıyı 2 saniye kısaltır.', 'İpucu yok ama kombo bonusun ikiye katlanır.', 'Bir kez kaçırırsan çarpan 1×’e döner.', 'Son tur üç kat puan değerinde.', 'Uzio her yavaş cevap için 10 puan çalar.', '5× kombo yaparsan bonus sandığı açılır.'],
    fr: ['Chaque bonne réponse raccourcit le minuteur de 2 secondes.', 'Aucun indice, mais ton bonus de combo double.', 'Une erreur et le multiplicateur retombe à 1×.', 'La dernière manche vaut triple points.', 'Uzio te vole 10 points à chaque réponse lente.', 'Atteins un combo 5× pour ouvrir un coffre bonus.'],
    de: ['Jede richtige Antwort verkürzt den Timer um 2 Sekunden.', 'Keine Hinweise, aber dein Combo-Bonus verdoppelt sich.', 'Ein Fehler und der Multiplikator fällt auf 1× zurück.', 'Die letzte Runde zählt dreifach.', 'Uzio klaut dir 10 Punkte pro langsamer Antwort.', 'Erreiche eine 5×-Combo und öffne eine Bonus-Truhe.']
  };
  var CH_LABEL = {
    en: ['Mode', 'Twist', 'Difficulty', 'Reward'], tr: ['Mod', 'Sürpriz kural', 'Zorluk', 'Ödül'],
    fr: ['Mode', 'Règle spéciale', 'Difficulté', 'Récompense'], de: ['Modus', 'Twist', 'Schwierigkeit', 'Belohnung']
  };
  var CH_OUT = { en: 'Want another one? Just say “another”, or ask for an easier or harder version.', tr: 'Bir tane daha ister misin? “Bir tane daha” de ya da daha kolay/zor bir sürüm iste.', fr: 'Un autre ? Dis « un autre », ou demande une version plus facile ou plus difficile.', de: 'Noch eine? Sag einfach „noch eine“ oder bitte um eine leichtere oder härtere Version.' };

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function makeChallenge(lang, q, profile) {
    var diff = 2;
    if (profile && profile.level === 'start') diff = 1; else if (profile && profile.level === 'conf') diff = 3;
    var raw = q.text;
    if (/ (easy|easier|chill|relaxed|kolay|daha kolay|facile|plus facile|leicht|leichter|einfach) /.test(raw)) diff = 1;
    if (/ (hard|harder|hardest|insane|impossible|spicy|zor|daha zor|imkansiz|difficile|plus difficile|schwer|schwerer|unmoglich) /.test(raw)) diff = 3;
    var mode = null;
    MODES.forEach(function (m) { if (raw.indexOf(' ' + norm(m)) > -1) mode = m; });
    if (!mode && / (boss|patron|endgegner) /.test(raw)) mode = 'Boss Battle';
    if (!mode) mode = pick(diff === 3 ? ['Boss Battle', 'Perfect Run', 'Risk It', 'Rapid Fire'] : diff === 1 ? ['Rapid Fire', 'Puzzle Drop', 'Beat Uzio'] : MODES);
    var mm = MODE_MIN[mode], dur = mm[0] + ' ' + UNIT[mm[1]][lang];
    var xp = [120, 150, 200, 250][Math.min(3, diff + (Math.random() > .5 ? 1 : 0))];
    var coins = 20 * diff + Math.floor(Math.random() * 3) * 10;
    var lab = CH_LABEL[lang], pep = new Array(diff + 1).join('🌶️');
    return '🎯 **' + pick(ADJ) + ' ' + pick(NOUN) + '**\n' +
      lab[0] + ': **' + mode + '** · ' + dur + '\n' +
      lab[1] + ': ' + pick(TWISTS[lang]) + '\n' +
      lab[2] + ': ' + pep + '\n' +
      lab[3] + ': **+' + xp + ' XP** & ' + coins + ' 🪙\n\n' + CH_OUT[lang];
  }

  function dyn(kind, lang, q, profile, ctx) {
    var name = profile && profile.name, ui = UI[lang];
    if (kind === 'challenge') return makeChallenge(lang, q, profile);
    if (kind === 'hello') return (name ? ui.greetNamed.replace('{n}', name) : ui.greet);
    if (kind === 'me') {
      var lv = profile && profile.level && PROFILE_LEVEL[profile.level] ? PROFILE_LEVEL[profile.level][lang] : null;
      var ints = profile && profile.interests && profile.interests.length ? profile.interests.join(', ') : null;
      var L = {
        en: ['You haven’t told me your name yet. Open the account menu → **Replay welcome** to set it.', 'You’re **{n}**', 'Level 7 · Explorer with 2,340 XP, 640 coins and a 4-day streak (sample stats for now)', 'Play style', 'Interests'],
        tr: ['Henüz adını söylemedin. Hesap menüsü → **Karşılama ekranını yeniden göster** ile ayarlayabilirsin.', 'Sen **{n}**’sin', '7. Seviye · Kâşif; 2.340 XP, 640 jeton ve 4 günlük seri (şimdilik örnek veriler)', 'Oyun tarzı', 'İlgi alanları'],
        fr: ['Tu ne m’as pas encore dit ton prénom. Menu du compte → **Revoir l’accueil** pour le définir.', 'Tu es **{n}**', 'Niveau 7 · Explorateur avec 2 340 XP, 640 pièces et une série de 4 jours (stats d’exemple pour l’instant)', 'Style de jeu', 'Centres d’intérêt'],
        de: ['Du hast mir deinen Namen noch nicht verraten. Kontomenü → **Begrüßung wiederholen**, um ihn zu setzen.', 'Du bist **{n}**', 'Level 7 · Explorer mit 2.340 XP, 640 Münzen und einer 4-Tage-Serie (aktuell Beispielwerte)', 'Spielstil', 'Interessen']
      }[lang];
      if (!name) return L[0];
      var out = L[1].replace('{n}', name) + ': ' + L[2] + '.';
      if (lv) out += '\n' + L[3] + ': **' + lv + '**';
      if (ints) out += '\n' + L[4] + ': ' + ints;
      return out;
    }
    return '';
  }

  /* ---------- the public reply() ---------- */
  function reply(text, opts) {
    opts = opts || {};
    var lang = LANGS.indexOf(opts.lang) > -1 ? opts.lang : 'en', ui = UI[lang];
    var state = opts.state || {};
    var q = parse(text);
    var out = { text: '', go: [], rel: [], id: null };

    /* direct topic (suggestion chips) */
    var entry = opts.id ? BY_ID[opts.id] : null;
    var top = 0, second = 0, secondE = null;

    if (!entry) {
      if (!q.tok.length) { out.text = ui.greet; out.rel = ['can', 'challenge', 'modes']; return out; }
      /* "more" / "another" follow-ups */
      if (state.last && MORE_RE.test(q.text.trim() + ' ')) {
        var le = BY_ID[state.last];
        if (le) {
          if (le.dynamic === 'challenge') { entry = le; }
          else { out.text = ui.more; out.go = le.go || []; out.rel = (le.rel || []).slice(); out.id = le.id; return out; }
        }
      }
      if (!entry && state.last && BY_ID[state.last] && BY_ID[state.last].dynamic === 'challenge' && / (another|again|one more|new one|bir tane daha|bir daha|un autre|encore une|noch eine|nochmal) /.test(q.text)) entry = BY_ID[state.last];
      if (!entry) {
        var scored = KB.map(function (e) { return { e: e, s: scoreEntry(e, q) }; }).sort(function (a, b) { return b.s - a.s; });
        top = scored[0].s; second = scored[1].s; secondE = scored[1].e;
        /* gentle context: a short follow-up leans toward the last topic's neighbours */
        if (state.last && q.tok.length <= 4 && top < 3.2 && BY_ID[state.last]) {
          var nb = BY_ID[state.last].rel || [];
          for (var i = 0; i < scored.length; i++) if (nb.indexOf(scored[i].e.id) > -1) scored[i].s += 0.6;
          scored.sort(function (a, b) { return b.s - a.s; });
          top = scored[0].s;
        }
        if (top >= 1.2) entry = scored[0].e;
      }
    }

    if (!entry) {
      out.text = ui.fallback;
      var pool = ['modes', 'shop', 'xp', 'challenge', 'videos', 'languages', 'quests', 'uzioai'];
      out.rel = pool.sort(function () { return Math.random() - .5; }).slice(0, 4);
      return out;
    }

    out.id = entry.id;
    var a = entry.dynamic ? dyn(entry.dynamic, lang, q, opts.profile, state) : (typeof entry.a === 'function' ? entry.a(lang, q, opts.profile) : entry.a[lang]);
    out.text = a;
    out.go = entry.go || [];
    out.rel = (entry.rel || []).slice();
    /* a runner-up that was nearly as strong is worth surfacing */
    if (top && second >= top * 0.75 && secondE && secondE.id !== entry.id && out.rel.indexOf(secondE.id) < 0 && secondE.max == null) out.rel.unshift(secondE.id);
    out.rel = out.rel.filter(function (id) { return id !== entry.id; }).slice(0, 3);
    return out;
  }

  /* ======================================================================
     PART 2 · CHAT PANEL (only runs in a browser)
     ====================================================================== */
  var api = { reply: reply, KB: KB, UI: UI, norm: norm, LANGS: LANGS, title: function (id, lang) { return BY_ID[id].t[lang]; } };

  if (typeof document === 'undefined' || !win.document) return api;

  var doc = win.document, docEl = doc.documentElement;
  var reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isHub = !!doc.getElementById('panel');
  var panel, logEl, form, input, sendBtn, chipsEl, titleEl, subEl, closeBtn, resetBtn;
  var state = { last: null, busy: false, open: false, started: false };
  var returnFocus = null;

  function curLang() {
    var l = docEl.lang;
    if (LANGS.indexOf(l) < 0) { try { l = win.localStorage.getItem('uzio-language'); } catch (e) {} }
    return LANGS.indexOf(l) > -1 ? l : 'en';
  }
  function profile() {
    try {
      var p = JSON.parse(win.localStorage.getItem('uzio-profile'));
      if (p && typeof p === 'object') return { name: typeof p.name === 'string' ? p.name.trim().slice(0, 20) : '', level: p.level || '', interests: Array.isArray(p.interests) ? p.interests : [] };
    } catch (e) {}
    return { name: '', level: '', interests: [] };
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>');
  }

  function build() {
    panel = doc.createElement('section');
    panel.className = 'uai' + (isHub ? ' uai--hub' : '');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'uaiTitle');
    panel.inert = true;
    panel.innerHTML =
      '<header class="uai-head">' +
        '<span class="uai-av" aria-hidden="true"></span>' +
        '<div class="uai-id"><b id="uaiTitle"></b><small id="uaiSub"></small></div>' +
        '<button class="uai-ib" type="button" data-uai="reset"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4.5h4.5"/></svg></button>' +
        '<button class="uai-ib" type="button" data-uai="close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/></svg></button>' +
      '</header>' +
      '<div class="uai-log" id="uaiLog" role="log" aria-live="polite"></div>' +
      '<div class="uai-chips" id="uaiChips"></div>' +
      '<form class="uai-form" autocomplete="off">' +
        '<input class="uai-input" type="text" maxlength="240" enterkeyhint="send" spellcheck="false">' +
        '<button class="uai-send" type="submit" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M6.5 11.5 12 6l5.5 5.5"/></svg></button>' +
      '</form>';
    doc.body.appendChild(panel);
    logEl = panel.querySelector('.uai-log'); chipsEl = panel.querySelector('.uai-chips');
    form = panel.querySelector('form'); input = panel.querySelector('.uai-input'); sendBtn = panel.querySelector('.uai-send');
    titleEl = panel.querySelector('#uaiTitle'); subEl = panel.querySelector('#uaiSub');
    closeBtn = panel.querySelector('[data-uai="close"]'); resetBtn = panel.querySelector('[data-uai="reset"]');

    form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value.trim(); if (v) { input.value = ''; sendBtn.disabled = true; ask(v); } });
    input.addEventListener('input', function () { sendBtn.disabled = !input.value.trim() || state.busy; });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    resetBtn.addEventListener('click', function () { reset(); });
    panel.addEventListener('click', function (e) {
      var c = e.target.closest('[data-id]');
      if (c && !state.busy) { ask(c.getAttribute('data-title'), c.getAttribute('data-id')); return; }
      var g = e.target.closest('[data-go]');
      if (g) go(g.getAttribute('data-go'));
    });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } });
    chipsEl.addEventListener('wheel', function (e) { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { chipsEl.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
    applyLang();
  }

  function applyLang() {
    if (!panel) return;
    var ui = UI[curLang()];
    titleEl.textContent = ui.title; subEl.textContent = ui.sub;
    input.placeholder = ui.ph; input.setAttribute('aria-label', ui.ph);
    sendBtn.setAttribute('aria-label', ui.send); sendBtn.title = ui.send;
    closeBtn.setAttribute('aria-label', ui.close); closeBtn.title = ui.close;
    resetBtn.setAttribute('aria-label', ui.reset); resetBtn.title = ui.reset;
    panel.setAttribute('aria-label', ui.title);
    Array.prototype.forEach.call(doc.querySelectorAll('.uzio-orb'), function (o) { o.setAttribute('aria-label', ui.open); });
  }

  function scrollDown() { logEl.scrollTop = logEl.scrollHeight; }
  function addUser(text) {
    var d = doc.createElement('div'); d.className = 'uai-msg uai-me'; d.textContent = text; logEl.appendChild(d); scrollDown();
  }
  function addBot() {
    var d = doc.createElement('div'); d.className = 'uai-msg uai-bot'; logEl.appendChild(d); scrollDown(); return d;
  }
  function typing() {
    var d = addBot(); d.classList.add('uai-typing');
    d.setAttribute('aria-label', UI[curLang()].thinking);
    d.innerHTML = '<i></i><i></i><i></i>'; return d;
  }
  function chipHtml(ids, lang) {
    return ids.filter(function (id) { return BY_ID[id]; }).map(function (id) {
      var t = BY_ID[id].t[lang];
      return '<button class="uai-chip" type="button" data-id="' + id + '" data-title="' + esc(t) + '">' + esc(t) + '</button>';
    }).join('');
  }
  function goHtml(views, lang) {
    return views.map(function (v) {
      var label = OPEN[lang].replace('{v}', VIEW_NAME[v][lang]);
      return '<button class="uai-go" type="button" data-go="' + v + '">' + esc(label) + ' <span aria-hidden="true">→</span></button>';
    }).join('');
  }
  function go(view) {
    if (isHub) {
      if (win.location.hash !== '#' + view) win.location.hash = view;
      if (win.innerWidth < 640) setOpen(false);
    } else win.location.href = 'main-page.html#' + view;
  }

  function say(res, lang, instant) {
    var node = addBot(), words = res.text.split(/(\s+)/), i = 0;
    state.busy = true; sendBtn.disabled = true;
    function finish() {
      node.innerHTML = fmt(res.text);
      var extra = '';
      var g = goHtml(res.go.filter(function (v) { return !isHub || ('#' + v) !== win.location.hash; }), lang);
      if (g) extra += '<div class="uai-actions">' + g + '</div>';
      if (extra) { var a = doc.createElement('div'); a.className = 'uai-extra'; a.innerHTML = extra; node.appendChild(a); }
      chipsEl.innerHTML = chipHtml(res.rel, lang);
      chipsEl.scrollLeft = 0;
      state.busy = false; sendBtn.disabled = !input.value.trim(); scrollDown();
    }
    if (instant || reduce) { finish(); return; }
    var step = Math.max(1, Math.ceil(words.length / 70));
    (function tick() {
      i += step * 2;
      if (i >= words.length) { finish(); return; }
      node.innerHTML = fmt(words.slice(0, i).join(''));
      scrollDown();
      setTimeout(tick, 22);
    })();
  }

  function ask(text, id) {
    if (state.busy) return;
    var lang = curLang();
    addUser(text); chipsEl.innerHTML = '';
    var res = reply(text, { lang: lang, profile: profile(), state: state, id: id });
    state.last = res.id || state.last;
    state.busy = true; sendBtn.disabled = true;
    var t = typing();
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); say(res, lang); }, reduce ? 0 : 380 + Math.min(500, res.text.length * 1.2));
  }

  function reset() {
    logEl.innerHTML = ''; state.last = null; state.busy = false; chipsEl.innerHTML = '';
    start(true);
  }
  function start(force) {
    if (state.started && !force) return;
    state.started = true;
    var lang = curLang(), p = profile();
    var g = { text: p.name ? UI[lang].greetNamed.replace('{n}', p.name) : UI[lang].greet, go: [], rel: ['can', 'challenge', 'modes', 'shop'] };
    say(g, lang, true);
  }

  function setOpen(on, prompt) {
    if (!panel) build();
    if (on === state.open) { if (on && prompt) ask(prompt); return; }
    state.open = on;
    panel.classList.toggle('open', on);
    panel.inert = !on;
    Array.prototype.forEach.call(doc.querySelectorAll('.uzio-orb'), function (o) { o.classList.toggle('uai-active', on); o.setAttribute('aria-expanded', String(on)); });
    if (on) {
      returnFocus = doc.activeElement;
      applyLang(); start();
      if (prompt) ask(prompt);
      setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) {} }, reduce ? 0 : 160);
    } else {
      var rf = returnFocus && returnFocus.focus ? returnFocus : doc.querySelector('.uzio-orb');
      returnFocus = null;
      if (rf && rf.focus) try { rf.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  /* the orb opens the chat instead of navigating (the href stays as a no-JS fallback) */
  doc.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('.uzio-orb');
    if (!o || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setOpen(!state.open);
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.open && !panel.contains(doc.activeElement)) setOpen(false); });
  new MutationObserver(applyLang).observe(docEl, { attributes: true, attributeFilter: ['lang'] });
  Array.prototype.forEach.call(doc.querySelectorAll('.uzio-orb'), function (o) { o.setAttribute('aria-haspopup', 'dialog'); o.setAttribute('aria-expanded', 'false'); });

  api.open = function (prompt) { setOpen(true, prompt); };
  api.close = function () { setOpen(false); };
  return api;
});
