(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Toast ---------- */
  var toastEl = $('toast'), toastT = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- Language ---------- */
  var LANG_KEY = 'uzio-language';
  var langMenu = $('langMenu'), langCode = $('langCode'), menuLang = $('menuLang'), menuLangBtn = $('menuLangBtn'), menuLangLabel = $('menuLangLabel');
  var currentLang = 'en';
  try { currentLang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) {}
  if (!/^(en|tr|fr|de)$/.test(currentLang)) currentLang = 'en';

  var I18N = {
    tr: {
      'Home':'Ana Sayfa','Play':'Oyna','Practise':'Pratik Yap','Watch':'İzle','My Quest':'Görevim',
      'Account':'Hesap','Settings':'Ayarlar','My Plan':'Planım','Replay welcome':'Karşılama ekranını yeniden göster','Dark mode':'Karanlık mod',
      'Back to top':'Başa dön','Enter the game\'s Room':'Uzio’nun Odasına Gir',
      'Ready for some English? Pick something fun, continue your quest, or ask Uzio for a challenge.':'Biraz İngilizceye hazır mısın? Eğlenceli bir şey seç, görevine devam et ya da Uzio’dan bir meydan okuma iste.',
      'Choose a game. Beat your best.':'Bir oyun seç. Kendi rekorunu geç.','Fast English games for vocabulary, grammar, reading, listening and English IRL.':'Kelime, dil bilgisi, okuma, dinleme ve günlük İngilizce için hızlı oyunlar.',
      'Train one skill at a time':'Her seferinde bir beceri geliştir','Choose what you want to improve. Uzio can make each activity easier, harder or completely new.':'Geliştirmek istediğin beceriyi seç. Uzio her etkinliği daha kolay, daha zor veya tamamen yeni hâle getirebilir.',
      'Watch it. Catch it. Use it.':'İzle. Yakala. Kullan.','Short English videos with a tiny challenge after each one, so watching becomes practice.':'Her videonun sonunda kısa bir görev bulunan İngilizce videolar; böylece izlemek pratiğe dönüşür.',
      'See how far you have come':'Ne kadar ilerlediğini gör','Build streaks, collect skill badges and level up by actually using English.':'İngilizceyi gerçekten kullanarak seriler oluştur, beceri rozetleri kazan ve seviye atla.',
      'Continue where you left off':'Kaldığın yerden devam et','Find the mystery word from clues. You are 60% through.':'İpuçlarından gizemli kelimeyi bul. %60’ını tamamladın.','4 min left':'4 dk kaldı','Continue ▶':'Devam et ▶','Jump in':'Hemen başla',
      'Fast games. Instant feedback.':'Hızlı oyunlar. Anında geri bildirim.','Speak':'Konuş','Talk, role-play and build confidence.':'Konuş, rol yap ve özgüvenini geliştir.','Speaking':'Konuşma','Challenge me':'Beni zorla','Let Uzio choose your next task.':'Bir sonraki görevini Uzio seçsin.','Adaptive':'Uyarlanabilir','Short video. Tiny challenge after.':'Kısa video. Ardından mini görev.','Uzio picked this for you':'Uzio bunu senin için seçti','Can you beat my vocabulary challenge?':'Kelime görevimi geçebilir misin?','Try it →':'Dene →',
      "Today's quest":'Bugünün görevi','Learn':'Öğren','5 new words':'5 yeni kelime','1 quick game':'1 kısa oyun','1 minute with Uzio':'Uzio ile 1 dakika','English IRL · expression of the day':'Günlük İngilizce · günün ifadesi','Can you guess what it means before Uzio tells you?':'Uzio söylemeden önce anlamını tahmin edebilir misin?','Find out →':'Öğren →',
      'Quick Play':'Hızlı Oyun','Or let Uzio surprise you':'Ya da Uzio seni şaşırtsın','Word Rush':'Kelime Yarışı','Choose the right word before time runs out.':'Süre bitmeden doğru kelimeyi seç.','Vocabulary':'Kelime Bilgisi','Grammar Rescue':'Dil Bilgisi Kurtarma','Spot the mistake and fix the sentence.':'Hatayı bul ve cümleyi düzelt.','Grammar':'Dil Bilgisi','Clue Hunter':'İpucu Avcısı','Read closely and solve the mystery.':'Dikkatlice oku ve gizemi çöz.','Reading':'Okuma','Sound Detective':'Ses Dedektifi','Listen, notice and choose what you heard.':'Dinle, fark et ve duyduğunu seç.','Listening':'Dinleme','Match real expressions to real situations.':'Gerçek ifadeleri gerçek durumlarla eşleştir.','Real English':'Gerçek İngilizce','Beat Uzio':'Uzio’yu Geç','Answer before Uzio does.':'Uzio’dan önce cevapla.','AI Challenge':'Yapay Zekâ Görevi','Sentence Builder':'Cümle Kurucu','Put the pieces in the best order.':'Parçaları en doğru sıraya koy.','Surprise Me':'Beni Şaşırt','No choosing. Uzio picks your game.':'Seçim yok. Oyunu Uzio seçer.','Any skill':'Herhangi bir beceri',
      'Choose a skill':'Bir beceri seç','Uzio adjusts the level as you go':'Uzio ilerledikçe seviyeyi ayarlar','Build useful words and use them in context.':'Kullanışlı kelimeler öğren ve bağlam içinde kullan.','Notice patterns, fix errors and make sentences.':'Kalıpları fark et, hataları düzelt ve cümleler kur.','Role-play, answer and keep a conversation going.':'Rol yap, cevap ver ve konuşmayı sürdür.','Find ideas, clues and details without over-translating.':'Her şeyi çevirmeden fikirleri, ipuçlarını ve ayrıntıları bul.','Catch key words, meaning and natural expressions.':'Anahtar kelimeleri, anlamı ve doğal ifadeleri yakala.','Recommended for you':'Senin için önerilen','Past Simple: tell the story':'Past Simple: hikâyeyi anlat','You know the forms. Now practise using them in a short story instead of another worksheet.':'Yapıları biliyorsun. Şimdi başka bir çalışma kâğıdı yerine kısa bir hikâyede kullanarak pratik yap.','Speaking + grammar':'Konuşma + dil bilgisi','Start challenge':'Göreve başla','Make it yours':'Kendine göre uyarlay','Tell Uzio what you want to practise.':'Uzio’ya ne çalışmak istediğini söyle.',
      'Watch & Try':'İzle ve Dene','Every video ends with one tiny challenge':'Her video küçük bir görevle biter','Save for later':'Daha sonrası için kaydet','NEW':'YENİ',
      'Explorer':'Kâşif','LEVEL':'SEVİYE','660 XP to Level 8':'8. seviyeye 660 XP','Small practice counts':'Küçük pratikler de önemlidir','You used English 4 days in a row. Come back tomorrow to make it 5.':'İngilizceyi art arda 4 gün kullandın. Seriyi 5 güne çıkarmak için yarın tekrar gel.','Skill badges':'Beceri rozetleri','Earn them by using English':'İngilizce kullanarak kazan','Word Wizard':'Kelime Sihirbazı','Learn and use 50 words':'50 kelime öğren ve kullan','Brave Speaker':'Cesur Konuşmacı','Complete 5 speaking challenges':'5 konuşma görevini tamamla','Grammar Detective':'Dil Bilgisi Dedektifi','Fix 20 sentence mistakes':'20 cümle hatasını düzelt','Book Explorer':'Kitap Kâşifi','Finish 5 reading challenges':'5 okuma görevini tamamla','Idiom Hunter':'Deyim Avcısı','Learn 10 English IRL expressions':'10 günlük İngilizce ifadesi öğren','Earned ✓':'Kazanıldı ✓','Our class quest':'Sınıf görevimiz','Everyone contributes':'Herkes katkıda bulunur','2,160 XP to go':'2.160 XP kaldı','Reward: choose the class playlist':'Ödül: sınıf çalma listesini seç',
      'Hi! I\'m Uzio.':'Merhaba! Ben Uzio.','I\'ll help you practise English. What should I call you?':'İngilizce pratiği yapmana yardım edeceğim. Sana nasıl hitap edeyim?','Your name':'Adın','How do you like to play?':'İngilizce konusunda kendini nasıl hissediyorsun?','Play style':'İngilizce seviyesi','Just starting':'Yeni başlıyorum','I know some words and short sentences.':'Bazı kelimeleri ve kısa cümleleri biliyorum.','Getting there':'İlerliyorum','I can talk about everyday things.':'Günlük konular hakkında konuşabiliyorum.','Pretty confident':'Oldukça kendime güveniyorum','I want to sound more natural.':'Daha doğal konuşmak istiyorum.','What do you like?':'Nelerden hoşlanırsın?','Pick up to 3. I\'ll use them in your practice.':'En fazla 3 tane seç. Bunları pratiklerinde kullanacağım.','Interests':'İlgi alanları','All set':'Her şey hazır','Your game hub is ready. You can redo this any time from the menu.':'Ana sayfan hazır. Bunu menüden istediğin zaman yeniden yapabilirsin.','Skip for now':'Şimdilik geç','Back':'Geri','Let\'s go →':'Başlayalım →','Next':'İleri','Pick up to 3 ✨':'En fazla 3 tane seç ✨','Practise':'Pratik Yap','Games':'Oyunlar','Music':'Müzik','Sports':'Spor','Animals':'Hayvanlar','Space':'Uzay','Food':'Yemek','Movies':'Filmler','Technology':'Teknoloji','Art':'Sanat'
    },
    fr: {
      'Home':'Accueil','Play':'Jouer','Practise':'S’entraîner','Watch':'Regarder','My Quest':'Ma quête','Account':'Compte','Settings':'Réglages','My Plan':'Mon programme','Replay welcome':'Revoir l’accueil','Dark mode':'Mode sombre','Back to top':'Retour en haut','Enter the game\'s Room':'Entrer dans la chambre d’Uzio',
      'Ready for some English? Pick something fun, continue your quest, or ask Uzio for a challenge.':'Prêt pour un peu d’anglais ? Choisis une activité amusante, continue ta quête ou demande un défi à Uzio.','Choose a game. Beat your best.':'Choisis un jeu. Bats ton record.','Fast English games for vocabulary, grammar, reading, listening and English IRL.':'Des jeux rapides pour le vocabulaire, la grammaire, la lecture, l’écoute et l’anglais de la vie réelle.','Train one skill at a time':'Travaille une compétence à la fois','Choose what you want to improve. Uzio can make each activity easier, harder or completely new.':'Choisis ce que tu veux améliorer. Uzio peut rendre chaque activité plus facile, plus difficile ou complètement nouvelle.','Watch it. Catch it. Use it.':'Regarde. Repère. Utilise.','Short English videos with a tiny challenge after each one, so watching becomes practice.':'De courtes vidéos en anglais avec un mini-défi après chacune, pour transformer le visionnage en pratique.','See how far you have come':'Vois tes progrès','Build streaks, collect skill badges and level up by actually using English.':'Crée des séries, gagne des badges et monte de niveau en utilisant vraiment l’anglais.',
      'Continue where you left off':'Reprends là où tu t’es arrêté','Find the mystery word from clues. You are 60% through.':'Trouve le mot mystère grâce aux indices. Tu as terminé 60 %.','4 min left':'4 min restantes','Continue ▶':'Continuer ▶','Jump in':'Commencer','Fast games. Instant feedback.':'Jeux rapides. Retour immédiat.','Speak':'Parler','Talk, role-play and build confidence.':'Parle, joue des rôles et prends confiance.','Speaking':'Expression orale','Challenge me':'Défie-moi','Let Uzio choose your next task.':'Laisse Uzio choisir ta prochaine activité.','Adaptive':'Adaptatif','Short video. Tiny challenge after.':'Courte vidéo. Mini-défi ensuite.','Uzio picked this for you':'Uzio a choisi ceci pour toi','Can you beat my vocabulary challenge?':'Peux-tu réussir mon défi de vocabulaire ?','Try it →':'Essayer →',"Today's quest":'Quête du jour','Learn':'Apprendre','5 new words':'5 nouveaux mots','1 quick game':'1 jeu rapide','1 minute with Uzio':'1 minute avec Uzio','English IRL · expression of the day':'Anglais réel · expression du jour','Can you guess what it means before Uzio tells you?':'Peux-tu deviner le sens avant qu’Uzio te le dise ?','Find out →':'Découvrir →',
      'Quick Play':'Jeu rapide','Or let Uzio surprise you':'Ou laisse Uzio te surprendre','Choose a skill':'Choisis une compétence','Uzio adjusts the level as you go':'Uzio adapte le niveau au fur et à mesure','Vocabulary':'Vocabulaire','Grammar':'Grammaire','Reading':'Lecture','Listening':'Compréhension orale','Recommended for you':'Recommandé pour toi','Start challenge':'Commencer le défi','Make it yours':'Personnalise','Tell Uzio what you want to practise.':'Dis à Uzio ce que tu veux travailler.','Watch & Try':'Regarde et essaie','Every video ends with one tiny challenge':'Chaque vidéo se termine par un mini-défi','Save for later':'Enregistrer pour plus tard','NEW':'NOUVEAU','Explorer':'Explorateur','LEVEL':'NIVEAU','Small practice counts':'Chaque petite pratique compte','Skill badges':'Badges de compétence','Earn them by using English':'Gagne-les en utilisant l’anglais','Our class quest':'Quête de la classe','Everyone contributes':'Tout le monde participe',
      'Hi! I\'m Uzio.':'Salut ! Je suis Uzio.','I\'ll help you practise English. What should I call you?':'Je vais t’aider à pratiquer l’anglais. Comment dois-je t’appeler ?','Your name':'Ton prénom','How do you like to play?':'Comment te sens-tu en anglais ?','Play style':'Niveau d’anglais','Just starting':'Je débute','I know some words and short sentences.':'Je connais quelques mots et phrases courtes.','Getting there':'Je progresse','I can talk about everyday things.':'Je peux parler de choses du quotidien.','Pretty confident':'Assez à l’aise','I want to sound more natural.':'Je veux parler plus naturellement.','What do you like?':'Qu’est-ce que tu aimes ?','Pick up to 3. I\'ll use them in your practice.':'Choisis-en jusqu’à 3. Je les utiliserai dans tes activités.','Interests':'Centres d’intérêt','Your game hub is ready. You can redo this any time from the menu.':'Ta page d’accueil est prête. Tu peux recommencer à tout moment depuis le menu.','Skip for now':'Passer pour l’instant','Back':'Retour','Let\'s go →':'C’est parti →','Next':'Suivant','Pick up to 3 ✨':'Choisis-en jusqu’à 3 ✨','Games':'Jeux','Music':'Musique','Sports':'Sports','Animals':'Animaux','Space':'Espace','Food':'Cuisine','Movies':'Films','Technology':'Technologie','Art':'Art'
    },
    de: {
      'Home':'Start','Play':'Spielen','Practise':'Üben','Watch':'Ansehen','My Quest':'Meine Mission','Account':'Konto','Settings':'Einstellungen','My Plan':'Mein Plan','Replay welcome':'Begrüßung wiederholen','Dark mode':'Dunkelmodus','Back to top':'Nach oben','Enter the game\'s Room':'Uzios Zimmer betreten',
      'Ready for some English? Pick something fun, continue your quest, or ask Uzio for a challenge.':'Bereit für etwas Englisch? Wähle etwas Lustiges, setze deine Mission fort oder bitte Uzio um eine Herausforderung.','Choose a game. Beat your best.':'Wähle ein Spiel. Schlage deinen Rekord.','Fast English games for vocabulary, grammar, reading, listening and English IRL.':'Schnelle Englischspiele für Wortschatz, Grammatik, Lesen, Hören und Englisch im Alltag.','Train one skill at a time':'Trainiere eine Fähigkeit nach der anderen','Choose what you want to improve. Uzio can make each activity easier, harder or completely new.':'Wähle, was du verbessern möchtest. Uzio kann jede Aktivität leichter, schwieriger oder ganz neu gestalten.','Watch it. Catch it. Use it.':'Ansehen. Verstehen. Anwenden.','Short English videos with a tiny challenge after each one, so watching becomes practice.':'Kurze englische Videos mit einer kleinen Aufgabe danach – so wird Zuschauen zur Übung.','See how far you have come':'Sieh, wie weit du gekommen bist','Build streaks, collect skill badges and level up by actually using English.':'Baue Serien auf, sammle Abzeichen und steige auf, indem du Englisch wirklich benutzt.',
      'Continue where you left off':'Mach dort weiter, wo du aufgehört hast','Find the mystery word from clues. You are 60% through.':'Finde das geheimnisvolle Wort mithilfe der Hinweise. Du bist zu 60 % fertig.','4 min left':'Noch 4 Min.','Continue ▶':'Weiter ▶','Jump in':'Loslegen','Fast games. Instant feedback.':'Schnelle Spiele. Sofortiges Feedback.','Speak':'Sprechen','Talk, role-play and build confidence.':'Sprich, spiele Rollen und werde sicherer.','Speaking':'Sprechen','Challenge me':'Fordere mich heraus','Let Uzio choose your next task.':'Lass Uzio deine nächste Aufgabe auswählen.','Adaptive':'Adaptiv','Short video. Tiny challenge after.':'Kurzes Video. Danach eine Mini-Aufgabe.','Uzio picked this for you':'Uzio hat das für dich ausgesucht','Can you beat my vocabulary challenge?':'Schaffst du meine Wortschatz-Challenge?','Try it →':'Ausprobieren →',"Today's quest":'Heutige Mission','Learn':'Lernen','5 new words':'5 neue Wörter','1 quick game':'1 schnelles Spiel','1 minute with Uzio':'1 Minute mit Uzio','English IRL · expression of the day':'Englisch im Alltag · Ausdruck des Tages','Can you guess what it means before Uzio tells you?':'Kannst du die Bedeutung erraten, bevor Uzio sie dir sagt?','Find out →':'Herausfinden →',
      'Quick Play':'Schnelles Spiel','Or let Uzio surprise you':'Oder lass dich von Uzio überraschen','Choose a skill':'Wähle eine Fähigkeit','Uzio adjusts the level as you go':'Uzio passt das Niveau unterwegs an','Vocabulary':'Wortschatz','Grammar':'Grammatik','Reading':'Lesen','Listening':'Hören','Recommended for you':'Für dich empfohlen','Start challenge':'Challenge starten','Make it yours':'Mach es zu deinem','Tell Uzio what you want to practise.':'Sag Uzio, was du üben möchtest.','Watch & Try':'Ansehen & Ausprobieren','Every video ends with one tiny challenge':'Jedes Video endet mit einer kleinen Aufgabe','Save for later':'Für später speichern','NEW':'NEU','Explorer':'Entdecker','LEVEL':'LEVEL','Small practice counts':'Auch kleine Übungen zählen','Skill badges':'Fähigkeitsabzeichen','Earn them by using English':'Verdiene sie, indem du Englisch benutzt','Our class quest':'Unsere Klassenmission','Everyone contributes':'Alle tragen dazu bei',
      'Hi! I\'m Uzio.':'Hallo! Ich bin Uzio.','I\'ll help you practise English. What should I call you?':'Ich helfe dir beim Englischüben. Wie soll ich dich nennen?','Your name':'Dein Name','How do you like to play?':'Wie fühlst du dich mit Englisch?','Play style':'Englischniveau','Just starting':'Ich fange gerade an','I know some words and short sentences.':'Ich kenne einige Wörter und kurze Sätze.','Getting there':'Ich komme voran','I can talk about everyday things.':'Ich kann über Alltagsthemen sprechen.','Pretty confident':'Ziemlich sicher','I want to sound more natural.':'Ich möchte natürlicher klingen.','What do you like?':'Was magst du?','Pick up to 3. I\'ll use them in your practice.':'Wähle bis zu 3. Ich verwende sie in deinen Übungen.','Interests':'Interessen','Your game hub is ready. You can redo this any time from the menu.':'Deine Startseite ist fertig. Du kannst dies jederzeit über das Menü wiederholen.','Skip for now':'Vorerst überspringen','Back':'Zurück','Let\'s go →':'Los geht’s →','Next':'Weiter','Pick up to 3 ✨':'Wähle bis zu 3 ✨','Games':'Spiele','Music':'Musik','Sports':'Sport','Animals':'Tiere','Space':'Weltraum','Food':'Essen','Movies':'Filme','Technology':'Technologie','Art':'Kunst'
    }
  };

  /* ---------- Gamification-specific translations ---------- */
  Object.assign(I18N.tr, {"Perks":"Avantajlar","Uzio AI":"Uzio AI","Your game hub: keep your streak alive, chase XP, complete quests and unlock rewards.":"Oyun merkezinde serini koru, XP kazan, görevleri tamamla ve ödüllerin kilidini aç.","Pick a game. Chase a new high score.":"Bir oyun seç. Yeni bir rekorun peşine düş.","Jump into fast challenges, timed rounds, boss battles and multiplayer-style missions.":"Hızlı görevlere, süreli turlara, boss savaşlarına ve çok oyunculu tarzı görevlere dal.","Watch. Unlock. Play.":"İzle. Kilidi aç. Oyna.","Catch short clips, trailers and strategy drops that reveal new challenges, boosts and secret rewards.":"Yeni görevleri, güçlendirmeleri ve gizli ödülleri açığa çıkaran kısa videoları, fragmanları ve strateji içeriklerini izle.","Your rewards. Your status. Your collection.":"Ödüllerin. Statün. Koleksiyonun.","Spend coins, collect badges, protect streaks and unlock cosmetic perks as you level up.":"Seviye atladıkça coin harca, rozet topla, serini koru ve kozmetik avantajların kilidini aç.","Your AI game master is ready.":"Yapay zekâ oyun yöneticin hazır.","Ask Uzio to build a challenge, remix a game, raise the difficulty or surprise you with a quest.":"Uzio’dan bir görev oluşturmasını, bir oyunu yeniden karıştırmasını, zorluğu artırmasını ya da seni sürpriz bir görevle şaşırtmasını iste.","Featured mission":"Öne çıkan görev","Neon Vault":"Neon Kasa","Clear 3 rounds, keep your combo alive and crack the final vault. You are 60% through.":"3 turu tamamla, kombonu koru ve final kasasını aç. Görevin %60’ını tamamladın.","+120 XP":"+120 XP","2× combo":"2× kombo","Jump in":"Hemen başla","Every action pushes your profile forward":"Her hareket profilini ileri taşır","Fast rounds, boss modes and score attacks.":"Hızlı turlar, boss modları ve skor mücadeleleri.","2–5 min":"2–5 dk","+ XP":"+ XP","Open Play":"Oyna bölümünü aç","Claim rewards, boosts and collection drops.":"Ödülleri, güçlendirmeleri ve koleksiyon içeriklerini al.","Rewards":"Ödüller","Coins":"Coinler","Open Perks":"Avantajları aç","Unlock clips, secrets and challenge drops.":"Videoların, sırların ve görev içeriklerinin kilidini aç.","New drops":"Yeni içerikler","+ bonus":"+ bonus","Open Watch":"İzle bölümünü aç","Let Uzio create your next challenge.":"Bir sonraki görevini Uzio oluştursun.","AI game master":"Yapay zekâ oyun yöneticisi","Open Uzio AI":"Uzio AI’ı aç","Uzio challenge drop":"Uzio görev sürprizi","Want a 90-second boss round?":"90 saniyelik bir boss turuna ne dersin?","Uzio can remix your recent games into a tougher challenge with bonus XP on the line.":"Uzio son oyunlarını bonus XP kazanabileceğin daha zorlu bir göreve dönüştürebilir.","Generate challenge →":"Görev oluştur →","Daily quests":"Günlük görevler","2 / 3 complete":"2 / 3 tamamlandı","Score Hunter":"Skor Avcısı","Beat one personal best":"Bir kişisel rekorunu geç","Combo Keeper":"Kombo Koruyucu","Reach a 5× combo":"5× komboya ulaş","Uzio Dare":"Uzio Meydan Okuması","Complete one AI-generated challenge":"Yapay zekânın oluşturduğu bir görevi tamamla","Limited-time event":"Süreli etkinlik","Double XP Hour":"Çifte XP Saati","Complete any three games before the timer expires to unlock a mystery perk.":"Süre bitmeden üç oyun tamamla ve gizemli bir avantajın kilidini aç.","Enter event →":"Etkinliğe gir →","Game modes":"Oyun modları","Choose your route or let Uzio randomize it":"Rotanı seç ya da Uzio’nun rastgele belirlemesine izin ver","Rapid Fire":"Hızlı Atış","Answer, react and build a combo before time runs out.":"Süre bitmeden cevap ver, tepki göster ve kombo oluştur.","90 sec":"90 sn","Score attack":"Skor saldırısı","Boss Battle":"Boss Savaşı","Survive three stages and defeat the final boss.":"Üç aşamayı geç ve final bossunu yen.","5 min":"5 dk","+180 XP":"+180 XP","Puzzle Drop":"Bulmaca Düşüşü","Solve a chain of clues with fewer hints for more points.":"Daha az ipucuyla bir ipucu zincirini çöz ve daha çok puan kazan.","3 min":"3 dk","Logic":"Mantık","Perfect Run":"Kusursuz Seri","One mistake resets the multiplier. How far can you go?":"Tek hata çarpanı sıfırlar. Ne kadar ilerleyebilirsin?","Hard":"Zor","Combo":"Kombo","Beat Uzio":"Uzio’yu Geç","Race Uzio to the answer and steal the bonus.":"Cevaba Uzio’dan önce ulaş ve bonusu kap.","2 min":"2 dk","AI duel":"Yapay zekâ düellosu","Risk It":"Riske Gir","Choose the safer reward or gamble your points for more.":"Daha güvenli ödülü seç ya da daha fazlası için puanlarını riske at.","High stakes":"Yüksek risk","Quest Run":"Görev Koşusu","Clear connected mini-games to reach the final chest.":"Final sandığına ulaşmak için bağlantılı mini oyunları tamamla.","6–8 min":"6–8 dk","Adventure":"Macera","Surprise Me":"Beni Şaşırt","No choosing. Uzio picks the mode, rule and difficulty.":"Seçim yok. Modu, kuralı ve zorluğu Uzio belirler.","Random":"Rastgele","Bonus XP":"Bonus XP","How top players protect a streak":"En iyi oyuncular serilerini nasıl koruyor","Strategy Drop · 2:10":"Strateji · 2:10","Boss Battle: new mode reveal":"Boss Savaşı: yeni mod tanıtımı","Mode Trailer · 1:35":"Mod Fragmanı · 1:35","3 tricks for a higher combo":"Daha yüksek kombo için 3 taktik","Quick Tip · 2:20":"Hızlı İpucu · 2:20","Mystery Perks explained":"Gizemli Avantajlar anlatılıyor","Reward Drop · 2:05":"Ödül İçeriği · 2:05","Inside the new Quest Run map":"Yeni Görev Koşusu haritasına bakış","Preview · 3:15":"Ön İzleme · 3:15","Uzio AI creates an impossible challenge":"Uzio AI imkânsız bir görev oluşturuyor","Uzio Lab · 2:50":"Uzio Lab · 2:50","Watch drops":"İzleme içerikleri","Some clips unlock quests, boosts or secret game modes":"Bazı videolar görevlerin, güçlendirmelerin veya gizli oyun modlarının kilidini açar","Save for later":"Sonra izlemek için kaydet","Player status":"Oyuncu durumu","660 XP to Level 8":"8. seviyeye 660 XP","Wallet":"Cüzdan","Spend or save":"Harca ya da biriktir","🪙 640 coins":"🪙 640 coin","Earn coins from quests, high scores, streak milestones and special events.":"Görevlerden, yüksek skorlardan, seri dönüm noktalarından ve özel etkinliklerden coin kazan.","🔥 4-day streak":"🔥 4 günlük seri","🏆 12 badges":"🏆 12 rozet","💎 3 rare items":"💎 3 nadir eşya","Perk shop":"Avantaj mağazası","Boosts and collectibles rotate regularly":"Güçlendirmeler ve koleksiyon ürünleri düzenli olarak yenilenir","Streak Shield":"Seri Kalkanı","Protect one missed day":"Kaçırdığın bir günü korur","120 coins":"120 coin","XP Booster":"XP Güçlendirici","Earn 2× XP for 20 minutes":"20 dakika boyunca 2× XP kazan","180 coins":"180 coin","Reroll Token":"Yeniden Çevirme Jetonu","Swap one daily quest instantly":"Bir günlük görevi anında değiştir","90 coins":"90 coin","Rare Drop":"Nadir Ödül","Unlock a random premium cosmetic":"Rastgele premium kozmetik aç","250 coins":"250 coin","Combo Saver":"Kombo Koruyucu","Keep your multiplier after one mistake":"Bir hatadan sonra çarpanını koru","160 coins":"160 coin","Next unlock":"Sıradaki kilit açma","Level 8":"8. Seviye","Mystery Profile Aura":"Gizemli Profil Aurası","660 XP to go":"660 XP kaldı","✨ Cosmetic reward":"✨ Kozmetik ödül","LEVEL":"SEVİYE","Uzio AI · Game Master":"Uzio AI · Oyun Yöneticisi","Tell me how you want to play.":"Nasıl oynamak istediğini söyle.","I can invent a challenge, remix a game, set a handicap, create a boss round or build a quest around your current streak.":"Bir görev tasarlayabilir, oyunu yeniden karıştırabilir, engel belirleyebilir, boss turu oluşturabilir ya da mevcut serine göre bir görev hazırlayabilirim.","Adaptive difficulty":"Uyarlanan zorluk","Fresh rules":"Yeni kurallar","Bonus objectives":"Bonus hedefler","Generate AI challenge":"Yapay zekâ görevi oluştur","Generate challenge":"Görev oluştur","Quick prompts":"Hızlı komutlar","Tap to send to Uzio":"Uzio’ya göndermek için dokun","“Give me a 2-minute challenge with a huge combo bonus.”":"“Bana büyük kombo bonuslu 2 dakikalık bir görev ver.”","“Turn my weakest game into a boss battle.”":"“En zayıf olduğum oyunu bir boss savaşına dönüştür.”","“Surprise me with a risky quest for 200 XP.”":"“200 XP’lik riskli bir görevle beni şaşırt.”","“Make a head-to-head challenge I can play with a friend.”":"“Bir arkadaşımla oynayabileceğim karşılıklı bir görev oluştur.”","Live modifier":"Canlı ayarlayıcı","Difficulty: Spicy 🌶️":"Zorluk: Acılı 🌶️","Uzio is ready to adjust timers, hints, multipliers and rewards while you play.":"Uzio oynarken süreleri, ipuçlarını, çarpanları ve ödülleri ayarlamaya hazır.","+25% XP":"+%25 XP","Fewer hints":"Daha az ipucu","Faster timer":"Daha hızlı sayaç","Uzio can also…":"Uzio ayrıca…","Build the rules around you":"Kuralları sana göre oluşturur","Remix":"Karıştır","Combine two game modes into one new challenge.":"İki oyun modunu tek bir yeni görevde birleştir.","AI":"YZ","Experimental":"Deneysel","Create a Boss":"Boss Oluştur","Generate a multi-stage boss with escalating rules.":"Giderek zorlaşan kurallara sahip çok aşamalı bir boss oluştur.","Boss":"Boss","Build a Quest":"Görev Oluştur","Turn several games into a connected adventure.":"Birden fazla oyunu bağlantılı bir maceraya dönüştür.","Quest":"Görev","Balance It":"Dengele","Tune a challenge so it feels fair but exciting.":"Görevi hem adil hem heyecanlı hissettirecek şekilde ayarla.","Smart":"Akıllı"});
  Object.assign(I18N.fr, {"Perks":"Avantages","Uzio AI":"Uzio AI","Your game hub: keep your streak alive, chase XP, complete quests and unlock rewards.":"Ton hub de jeu : garde ta série, gagne des XP, termine des quêtes et débloque des récompenses.","Pick a game. Chase a new high score.":"Choisis un jeu. Vise un nouveau record.","Jump into fast challenges, timed rounds, boss battles and multiplayer-style missions.":"Lance-toi dans des défis rapides, des manches chronométrées, des combats de boss et des missions façon multijoueur.","Watch. Unlock. Play.":"Regarde. Débloque. Joue.","Catch short clips, trailers and strategy drops that reveal new challenges, boosts and secret rewards.":"Regarde des clips, bandes-annonces et astuces qui révèlent de nouveaux défis, bonus et récompenses secrètes.","Your rewards. Your status. Your collection.":"Tes récompenses. Ton statut. Ta collection.","Spend coins, collect badges, protect streaks and unlock cosmetic perks as you level up.":"Dépense tes pièces, collectionne des badges, protège tes séries et débloque des avantages cosmétiques en montant de niveau.","Your AI game master is ready.":"Ton maître du jeu IA est prêt.","Ask Uzio to build a challenge, remix a game, raise the difficulty or surprise you with a quest.":"Demande à Uzio de créer un défi, remixer un jeu, augmenter la difficulté ou te surprendre avec une quête.","Featured mission":"Mission vedette","Neon Vault":"Coffre Néon","Clear 3 rounds, keep your combo alive and crack the final vault. You are 60% through.":"Termine 3 manches, garde ton combo et ouvre le coffre final. Tu as terminé 60 %.","4 min left":"4 min restantes","Continue ▶":"Continuer ▶","Jump in":"Joue maintenant","Every action pushes your profile forward":"Chaque action fait progresser ton profil","Play":"Jouer","Fast rounds, boss modes and score attacks.":"Manches rapides, modes boss et défis de score.","2–5 min":"2–5 min","Open Play":"Ouvrir Jouer","Claim rewards, boosts and collection drops.":"Récupère des récompenses, bonus et objets de collection.","Rewards":"Récompenses","Coins":"Pièces","Open Perks":"Ouvrir Avantages","Watch":"Regarder","Unlock clips, secrets and challenge drops.":"Débloque des clips, secrets et défis.","New drops":"Nouveautés","Open Watch":"Ouvrir Regarder","Let Uzio create your next challenge.":"Laisse Uzio créer ton prochain défi.","AI game master":"Maître du jeu IA","Adaptive":"Adaptatif","Open Uzio AI":"Ouvrir Uzio AI","Uzio challenge drop":"Défi surprise d’Uzio","Want a 90-second boss round?":"Une manche boss de 90 secondes ?","Uzio can remix your recent games into a tougher challenge with bonus XP on the line.":"Uzio peut remixer tes jeux récents en un défi plus difficile avec des XP bonus à gagner.","Generate challenge →":"Créer un défi →","Daily quests":"Quêtes quotidiennes","2 / 3 complete":"2 / 3 terminées","Score Hunter":"Chasseur de scores","Beat one personal best":"Bats un record personnel","Combo Keeper":"Gardien du combo","Reach a 5× combo":"Atteins un combo 5×","Uzio Dare":"Défi Uzio","Complete one AI-generated challenge":"Termine un défi généré par l’IA","Limited-time event":"Événement limité","Double XP Hour":"Heure XP doublée","Complete any three games before the timer expires to unlock a mystery perk.":"Termine trois jeux avant la fin du chrono pour débloquer un avantage mystère.","Enter event →":"Participer →","Game modes":"Modes de jeu","Choose your route or let Uzio randomize it":"Choisis ta route ou laisse Uzio décider au hasard","Rapid Fire":"Tir Rapide","Answer, react and build a combo before time runs out.":"Réponds, réagis et crée un combo avant la fin du temps.","90 sec":"90 s","Score attack":"Défi score","Boss Battle":"Combat de Boss","Survive three stages and defeat the final boss.":"Survis à trois étapes et bats le boss final.","5 min":"5 min","Puzzle Drop":"Défi Puzzle","Solve a chain of clues with fewer hints for more points.":"Résous une chaîne d’indices avec moins d’aide pour gagner plus de points.","3 min":"3 min","Logic":"Logique","Perfect Run":"Parcours Parfait","One mistake resets the multiplier. How far can you go?":"Une erreur remet le multiplicateur à zéro. Jusqu’où iras-tu ?","Hard":"Difficile","Combo":"Combo","Beat Uzio":"Bats Uzio","Race Uzio to the answer and steal the bonus.":"Trouve la réponse avant Uzio et prends le bonus.","2 min":"2 min","AI duel":"Duel IA","Risk It":"Prends le Risque","Choose the safer reward or gamble your points for more.":"Choisis la récompense sûre ou risque tes points pour gagner plus.","High stakes":"Gros enjeu","Quest Run":"Course de Quête","Clear connected mini-games to reach the final chest.":"Termine des mini-jeux liés pour atteindre le coffre final.","6–8 min":"6–8 min","Adventure":"Aventure","Surprise Me":"Surprends-moi","No choosing. Uzio picks the mode, rule and difficulty.":"Pas de choix. Uzio choisit le mode, la règle et la difficulté.","Random":"Aléatoire","Bonus XP":"XP bonus","How top players protect a streak":"Comment les meilleurs joueurs protègent leur série","Strategy Drop · 2:10":"Stratégie · 2:10","Boss Battle: new mode reveal":"Combat de Boss : nouveau mode","Mode Trailer · 1:35":"Bande-annonce · 1:35","3 tricks for a higher combo":"3 astuces pour un meilleur combo","Quick Tip · 2:20":"Astuce rapide · 2:20","Mystery Perks explained":"Les avantages mystère expliqués","Reward Drop · 2:05":"Récompense · 2:05","Inside the new Quest Run map":"Dans la nouvelle carte Course de Quête","Preview · 3:15":"Aperçu · 3:15","Uzio AI creates an impossible challenge":"Uzio AI crée un défi impossible","Uzio Lab · 2:50":"Uzio Lab · 2:50","Watch drops":"Vidéos à découvrir","Some clips unlock quests, boosts or secret game modes":"Certains clips débloquent des quêtes, bonus ou modes secrets","Save for later":"Enregistrer pour plus tard","Player status":"Statut du joueur","660 XP to Level 8":"660 XP avant le niveau 8","Wallet":"Portefeuille","Spend or save":"Dépenser ou économiser","🪙 640 coins":"🪙 640 pièces","Earn coins from quests, high scores, streak milestones and special events.":"Gagne des pièces avec les quêtes, records, séries et événements spéciaux.","🔥 4-day streak":"🔥 Série de 4 jours","🏆 12 badges":"🏆 12 badges","💎 3 rare items":"💎 3 objets rares","Perk shop":"Boutique d’avantages","Boosts and collectibles rotate regularly":"Les bonus et objets de collection changent régulièrement","Streak Shield":"Bouclier de Série","Protect one missed day":"Protège un jour manqué","120 coins":"120 pièces","XP Booster":"Booster XP","Earn 2× XP for 20 minutes":"Gagne 2× XP pendant 20 minutes","180 coins":"180 pièces","Reroll Token":"Jeton de Relance","Swap one daily quest instantly":"Remplace instantanément une quête quotidienne","90 coins":"90 pièces","Rare Drop":"Objet Rare","Unlock a random premium cosmetic":"Débloque un cosmétique premium aléatoire","250 coins":"250 pièces","Combo Saver":"Sauve-Combo","Keep your multiplier after one mistake":"Garde ton multiplicateur après une erreur","160 coins":"160 pièces","Next unlock":"Prochain déblocage","Level 8":"Niveau 8","Mystery Profile Aura":"Aura de Profil Mystère","660 XP to go":"660 XP restants","✨ Cosmetic reward":"✨ Récompense cosmétique","LEVEL":"NIVEAU","Uzio AI · Game Master":"Uzio AI · Maître du Jeu","Tell me how you want to play.":"Dis-moi comment tu veux jouer.","I can invent a challenge, remix a game, set a handicap, create a boss round or build a quest around your current streak.":"Je peux inventer un défi, remixer un jeu, ajouter un handicap, créer une manche boss ou bâtir une quête autour de ta série actuelle.","Adaptive difficulty":"Difficulté adaptative","Fresh rules":"Nouvelles règles","Bonus objectives":"Objectifs bonus","Generate challenge":"Créer un défi","Generate AI challenge":"Créer un défi IA","Quick prompts":"Suggestions rapides","Tap to send to Uzio":"Appuie pour envoyer à Uzio","“Give me a 2-minute challenge with a huge combo bonus.”":"« Donne-moi un défi de 2 minutes avec un énorme bonus de combo. »","“Turn my weakest game into a boss battle.”":"« Transforme mon jeu le plus faible en combat de boss. »","“Surprise me with a risky quest for 200 XP.”":"« Surprends-moi avec une quête risquée à 200 XP. »","“Make a head-to-head challenge I can play with a friend.”":"« Crée un défi face-à-face à jouer avec un ami. »","Live modifier":"Modificateur en direct","Difficulty: Spicy 🌶️":"Difficulté : Épicée 🌶️","Uzio is ready to adjust timers, hints, multipliers and rewards while you play.":"Uzio peut ajuster les chronos, indices, multiplicateurs et récompenses pendant que tu joues.","Fewer hints":"Moins d’indices","Faster timer":"Chrono plus rapide","Uzio can also…":"Uzio peut aussi…","Build the rules around you":"Créer les règles autour de toi","Remix":"Remixer","Combine two game modes into one new challenge.":"Combine deux modes de jeu en un nouveau défi.","AI":"IA","Experimental":"Expérimental","Create a Boss":"Créer un Boss","Generate a multi-stage boss with escalating rules.":"Crée un boss en plusieurs étapes avec des règles de plus en plus difficiles.","Boss":"Boss","Build a Quest":"Créer une Quête","Turn several games into a connected adventure.":"Transforme plusieurs jeux en une aventure liée.","Quest":"Quête","Balance It":"Équilibrer","Tune a challenge so it feels fair but exciting.":"Ajuste un défi pour qu’il soit juste mais excitant.","Smart":"Intelligent"});
  Object.assign(I18N.de, {"Perks":"Extras","Uzio AI":"Uzio AI","Your game hub: keep your streak alive, chase XP, complete quests and unlock rewards.":"Dein Game-Hub: Halte deine Serie, sammle XP, erfülle Quests und schalte Belohnungen frei.","Pick a game. Chase a new high score.":"Wähle ein Spiel. Jage einen neuen Highscore.","Jump into fast challenges, timed rounds, boss battles and multiplayer-style missions.":"Starte schnelle Challenges, Zeitrunden, Bosskämpfe und Missionen im Mehrspieler-Stil.","Watch. Unlock. Play.":"Ansehen. Freischalten. Spielen.","Catch short clips, trailers and strategy drops that reveal new challenges, boosts and secret rewards.":"Sieh kurze Clips, Trailer und Strategietipps mit neuen Challenges, Boosts und geheimen Belohnungen.","Your rewards. Your status. Your collection.":"Deine Belohnungen. Dein Status. Deine Sammlung.","Spend coins, collect badges, protect streaks and unlock cosmetic perks as you level up.":"Gib Münzen aus, sammle Abzeichen, schütze Serien und schalte beim Leveln kosmetische Extras frei.","Your AI game master is ready.":"Dein KI-Spielleiter ist bereit.","Ask Uzio to build a challenge, remix a game, raise the difficulty or surprise you with a quest.":"Bitte Uzio, eine Challenge zu bauen, ein Spiel zu remixen, die Schwierigkeit zu erhöhen oder dich mit einer Quest zu überraschen.","Featured mission":"Top-Mission","Neon Vault":"Neon-Tresor","Clear 3 rounds, keep your combo alive and crack the final vault. You are 60% through.":"Schaffe 3 Runden, halte deine Kombo und knacke den letzten Tresor. Du bist zu 60 % fertig.","4 min left":"Noch 4 Min.","Continue ▶":"Weiter ▶","Jump in":"Loslegen","Every action pushes your profile forward":"Jede Aktion bringt dein Profil weiter","Play":"Spielen","Fast rounds, boss modes and score attacks.":"Schnelle Runden, Bossmodi und Score-Angriffe.","2–5 min":"2–5 Min.","Open Play":"Spielen öffnen","Claim rewards, boosts and collection drops.":"Hol dir Belohnungen, Boosts und Sammlungs-Drops.","Rewards":"Belohnungen","Coins":"Münzen","Open Perks":"Extras öffnen","Watch":"Ansehen","Unlock clips, secrets and challenge drops.":"Schalte Clips, Geheimnisse und Challenge-Drops frei.","New drops":"Neue Drops","Open Watch":"Ansehen öffnen","Let Uzio create your next challenge.":"Lass Uzio deine nächste Challenge erstellen.","AI game master":"KI-Spielleiter","Adaptive":"Adaptiv","Open Uzio AI":"Uzio AI öffnen","Uzio challenge drop":"Uzio-Challenge-Drop","Want a 90-second boss round?":"Lust auf eine 90-Sekunden-Bossrunde?","Uzio can remix your recent games into a tougher challenge with bonus XP on the line.":"Uzio kann deine letzten Spiele in eine härtere Challenge mit Bonus-XP verwandeln.","Generate challenge →":"Challenge erstellen →","Daily quests":"Tägliche Quests","2 / 3 complete":"2 / 3 erledigt","Score Hunter":"Score-Jäger","Beat one personal best":"Schlage einen persönlichen Rekord","Combo Keeper":"Kombo-Hüter","Reach a 5× combo":"Erreiche eine 5×-Kombo","Uzio Dare":"Uzio-Mutprobe","Complete one AI-generated challenge":"Schließe eine KI-generierte Challenge ab","Limited-time event":"Zeitlich begrenztes Event","Double XP Hour":"Doppelte-XP-Stunde","Complete any three games before the timer expires to unlock a mystery perk.":"Beende drei Spiele vor Ablauf der Zeit, um ein Mystery-Extra freizuschalten.","Enter event →":"Event starten →","Game modes":"Spielmodi","Choose your route or let Uzio randomize it":"Wähle deinen Weg oder lass Uzio zufällig entscheiden","Rapid Fire":"Schnellfeuer","Answer, react and build a combo before time runs out.":"Antworte, reagiere und baue vor Ablauf der Zeit eine Kombo auf.","90 sec":"90 Sek.","Score attack":"Score-Angriff","Boss Battle":"Bosskampf","Survive three stages and defeat the final boss.":"Überstehe drei Phasen und besiege den Endboss.","5 min":"5 Min.","Puzzle Drop":"Puzzle-Drop","Solve a chain of clues with fewer hints for more points.":"Löse eine Hinweiskette mit weniger Hilfen für mehr Punkte.","3 min":"3 Min.","Logic":"Logik","Perfect Run":"Perfekter Lauf","One mistake resets the multiplier. How far can you go?":"Ein Fehler setzt den Multiplikator zurück. Wie weit kommst du?","Hard":"Schwer","Combo":"Kombo","Beat Uzio":"Schlage Uzio","Race Uzio to the answer and steal the bonus.":"Sei schneller als Uzio und schnapp dir den Bonus.","2 min":"2 Min.","AI duel":"KI-Duell","Risk It":"Riskier es","Choose the safer reward or gamble your points for more.":"Wähle die sichere Belohnung oder riskiere Punkte für mehr.","High stakes":"Hohes Risiko","Quest Run":"Quest-Lauf","Clear connected mini-games to reach the final chest.":"Schließe verbundene Minispiele ab und erreiche die letzte Truhe.","6–8 min":"6–8 Min.","Adventure":"Abenteuer","Surprise Me":"Überrasch mich","No choosing. Uzio picks the mode, rule and difficulty.":"Keine Auswahl. Uzio bestimmt Modus, Regel und Schwierigkeit.","Random":"Zufällig","Bonus XP":"Bonus-XP","How top players protect a streak":"Wie Top-Spieler ihre Serie schützen","Strategy Drop · 2:10":"Strategie · 2:10","Boss Battle: new mode reveal":"Bosskampf: Neuer Modus","Mode Trailer · 1:35":"Modus-Trailer · 1:35","3 tricks for a higher combo":"3 Tricks für eine höhere Kombo","Quick Tip · 2:20":"Kurztipp · 2:20","Mystery Perks explained":"Mystery-Extras erklärt","Reward Drop · 2:05":"Belohnungs-Drop · 2:05","Inside the new Quest Run map":"Einblick in die neue Quest-Lauf-Karte","Preview · 3:15":"Vorschau · 3:15","Uzio AI creates an impossible challenge":"Uzio AI erstellt eine unmögliche Challenge","Uzio Lab · 2:50":"Uzio Lab · 2:50","Watch drops":"Video-Drops","Some clips unlock quests, boosts or secret game modes":"Manche Clips schalten Quests, Boosts oder geheime Spielmodi frei","Save for later":"Für später speichern","Player status":"Spielerstatus","660 XP to Level 8":"660 XP bis Level 8","Wallet":"Geldbörse","Spend or save":"Ausgeben oder sparen","🪙 640 coins":"🪙 640 Münzen","Earn coins from quests, high scores, streak milestones and special events.":"Verdiene Münzen durch Quests, Highscores, Serien-Meilensteine und besondere Events.","🔥 4-day streak":"🔥 4-Tage-Serie","🏆 12 badges":"🏆 12 Abzeichen","💎 3 rare items":"💎 3 seltene Items","Perk shop":"Extra-Shop","Boosts and collectibles rotate regularly":"Boosts und Sammlerstücke wechseln regelmäßig","Streak Shield":"Serien-Schild","Protect one missed day":"Schützt einen verpassten Tag","120 coins":"120 Münzen","XP Booster":"XP-Booster","Earn 2× XP for 20 minutes":"20 Minuten lang 2× XP verdienen","180 coins":"180 Münzen","Reroll Token":"Neu-Würfeln-Token","Swap one daily quest instantly":"Tausche sofort eine tägliche Quest","90 coins":"90 Münzen","Rare Drop":"Seltener Drop","Unlock a random premium cosmetic":"Schalte ein zufälliges Premium-Kosmetikobjekt frei","250 coins":"250 Münzen","Combo Saver":"Kombo-Retter","Keep your multiplier after one mistake":"Behalte deinen Multiplikator nach einem Fehler","160 coins":"160 Münzen","Next unlock":"Nächste Freischaltung","Level 8":"Level 8","Mystery Profile Aura":"Mystery-Profil-Aura","660 XP to go":"Noch 660 XP","✨ Cosmetic reward":"✨ Kosmetische Belohnung","LEVEL":"LEVEL","Uzio AI · Game Master":"Uzio AI · Spielleiter","Tell me how you want to play.":"Sag mir, wie du spielen möchtest.","I can invent a challenge, remix a game, set a handicap, create a boss round or build a quest around your current streak.":"Ich kann eine Challenge erfinden, ein Spiel remixen, ein Handicap setzen, eine Bossrunde erstellen oder eine Quest um deine aktuelle Serie bauen.","Adaptive difficulty":"Adaptive Schwierigkeit","Fresh rules":"Neue Regeln","Bonus objectives":"Bonusziele","Generate challenge":"Challenge erstellen","Generate AI challenge":"KI-Challenge erstellen","Quick prompts":"Schnelle Vorschläge","Tap to send to Uzio":"Tippen, um an Uzio zu senden","“Give me a 2-minute challenge with a huge combo bonus.”":"„Gib mir eine 2-Minuten-Challenge mit riesigem Kombo-Bonus.“","“Turn my weakest game into a boss battle.”":"„Mach aus meinem schwächsten Spiel einen Bosskampf.“","“Surprise me with a risky quest for 200 XP.”":"„Überrasch mich mit einer riskanten Quest für 200 XP.“","“Make a head-to-head challenge I can play with a friend.”":"„Erstelle eine direkte Challenge, die ich mit einem Freund spielen kann.“","Live modifier":"Live-Modifikator","Difficulty: Spicy 🌶️":"Schwierigkeit: Scharf 🌶️","Uzio is ready to adjust timers, hints, multipliers and rewards while you play.":"Uzio kann beim Spielen Timer, Hinweise, Multiplikatoren und Belohnungen anpassen.","Fewer hints":"Weniger Hinweise","Faster timer":"Schnellerer Timer","Uzio can also…":"Uzio kann außerdem…","Build the rules around you":"Regeln passend zu dir bauen","Remix":"Remix","Combine two game modes into one new challenge.":"Kombiniere zwei Spielmodi zu einer neuen Challenge.","AI":"KI","Experimental":"Experimentell","Create a Boss":"Boss erstellen","Generate a multi-stage boss with escalating rules.":"Erstelle einen mehrstufigen Boss mit immer schwierigeren Regeln.","Boss":"Boss","Build a Quest":"Quest erstellen","Turn several games into a connected adventure.":"Verwandle mehrere Spiele in ein zusammenhängendes Abenteuer.","Quest":"Quest","Balance It":"Ausbalancieren","Tune a challenge so it feels fair but exciting.":"Passe eine Challenge so an, dass sie fair und spannend ist.","Smart":"Smart"});

  var ATTR_I18N = ['aria-label','placeholder','title'];
  function translateString(str) {
    if (currentLang === 'en' || !str) return str;
    var d = I18N[currentLang] || {}, lead = (str.match(/^\s*/) || [''])[0], tail = (str.match(/\s*$/) || [''])[0];
    var core = str.trim();
    if (d[core]) return lead + d[core] + tail;
    if (core === 'Search') return lead + (currentLang === 'tr' ? 'Ara' : currentLang === 'fr' ? 'Rechercher' : currentLang === 'de' ? 'Suchen' : 'Search') + tail;
    if (core === 'Language') return lead + (currentLang === 'tr' ? 'Dil' : currentLang === 'fr' ? 'Langue' : currentLang === 'de' ? 'Sprache' : 'Language') + tail;
    var m = core.match(/^Hey (.+) 👋$/);
    if (m) return lead + (currentLang === 'tr' ? 'Merhaba ' : currentLang === 'fr' ? 'Salut ' : 'Hallo ') + m[1] + ' 👋' + tail;
    m = core.match(/^Nice to meet you, (.+)!$/);
    if (m) return lead + (currentLang === 'tr' ? 'Tanıştığımıza memnun oldum, ' : currentLang === 'fr' ? 'Ravi de te rencontrer, ' : 'Schön, dich kennenzulernen, ') + m[1] + '!' + tail;
    m = core.match(/^All set, (.+)! 🎉$/);
    if (m) return lead + (currentLang === 'tr' ? 'Her şey hazır, ' : currentLang === 'fr' ? 'Tout est prêt, ' : 'Alles bereit, ') + m[1] + '! 🎉' + tail;
    m = core.match(/^Welcome, (.+)! ✨$/);
    if (m) return lead + (currentLang === 'tr' ? 'Hoş geldin, ' : currentLang === 'fr' ? 'Bienvenue, ' : 'Willkommen, ') + m[1] + '! ✨' + tail;
    m = core.match(/^(.+) · coming soon$/);
    if (m) return lead + translateString(m[1]) + (currentLang === 'tr' ? ' · yakında' : currentLang === 'fr' ? ' · bientôt disponible' : ' · demnächst') + tail;
    m = core.match(/^Practise (.+)$/);
    if (m) return lead + (currentLang === 'tr' ? 'Pratik: ' : currentLang === 'fr' ? 'S’entraîner : ' : 'Üben: ') + translateString(m[1]) + tail;
    return str;
  }

  function applyLanguage(scope) {
    scope = scope || document;
    root.lang = currentLang;
    document.documentElement.setAttribute('data-lang', currentLang);
    langCode.textContent = currentLang.toUpperCase();
    Array.prototype.forEach.call(langMenu.querySelectorAll('[data-lang]'), function (b) { b.setAttribute('aria-current', String(b.getAttribute('data-lang') === currentLang)); });
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      if (node.__uzioBase == null) node.__uzioBase = node.nodeValue;
      node.nodeValue = currentLang === 'en' ? node.__uzioBase : translateString(node.__uzioBase);
    });
    Array.prototype.forEach.call(scope.querySelectorAll ? scope.querySelectorAll('*') : [], function (el) {
      ATTR_I18N.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var key = '__uzio_' + a.replace('-', '_');
        if (el[key] == null) el[key] = el.getAttribute(a);
        el.setAttribute(a, currentLang === 'en' ? el[key] : translateString(el[key]));
      });
    });
  }

  function setLangMenu(open) {
    if (!langMenu || !menuLangBtn) return;
    langMenu.hidden = !open;
    menuLangBtn.setAttribute('aria-expanded', String(open));
  }
  if (menuLangBtn) menuLangBtn.addEventListener('click', function () { setLangMenu(langMenu.hidden); });
  langMenu.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]'); if (!b) return;
    currentLang = b.getAttribute('data-lang');
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (err) {}
    setLangMenu(false);
    applyLanguage(document);
    renderPanel(curView, true);
    applyLanguage(document);
    if (onb && onb.classList.contains('show')) { onbRender(); applyLanguage(onb); }
    var vv = views[curView] || views.home;
    $('eyebrow').textContent = translateString(vv.e); $('title').textContent = translateString(vv.t); $('blurb').textContent = translateString(vv.p);
    document.title = vv.e === 'Home' ? 'Uzio' : translateString(vv.e) + ' · Uzio';
  });


  /* ---------- Search pill ---------- */
  var searchPill = $('searchPill'), searchBtn = $('searchBtn'), searchInput = $('searchInput');
  function runSearch() {
    var q = (searchInput.value || '').trim().toLocaleLowerCase();
    if (!q) { searchInput.focus(); return; }
    document.querySelectorAll('.search-hit').forEach(function (el) { el.classList.remove('search-hit'); });
    var rootPanel = $('panel');
    var candidates = rootPanel ? rootPanel.querySelectorAll('.card, .tile, .row, .badge, .vitem, .group, [data-search]') : [];
    var hit = null;
    Array.prototype.some.call(candidates, function (el) {
      var txt = (el.innerText || el.textContent || '').toLocaleLowerCase();
      if (txt.indexOf(q) !== -1) { hit = el; return true; }
      return false;
    });
    if (hit) {
      hit.classList.add('search-hit');
      hit.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () { hit.classList.remove('search-hit'); }, 1100);
    } else {
      toast(currentLang === 'tr' ? 'Sonuç bulunamadı' : currentLang === 'fr' ? 'Aucun résultat' : currentLang === 'de' ? 'Kein Ergebnis gefunden' : 'No results found');
    }
  }
  searchBtn.addEventListener('click', function () { searchInput.focus(); if (searchInput.value.trim()) runSearch(); });
  searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); runSearch(); } });

    /* ---------- Account menu ---------- */
  var acct = $('acct'), acctBtn = $('acctBtn'), menu = $('menu');
  function setMenu(open) {
    acct.classList.toggle('open', open);
    acctBtn.setAttribute('aria-expanded', String(open));
    menu.inert = !open;
  }
  acctBtn.addEventListener('click', function () { setMenu(!acct.classList.contains('open')); });
  document.addEventListener('pointerdown', function (e) { if (!acct.contains(e.target)) { setMenu(false); setLangMenu(false); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); setLangMenu(false); } });
  menu.querySelectorAll('[data-menu]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(false); toast(b.getAttribute('data-menu') + ' · coming soon'); });
  });

  /* ---------- Theme (saved so the landing page matches) ---------- */
  var toggle = $('themeToggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function sync() { toggle.setAttribute('aria-checked', String(isDark())); }
  sync();
  toggle.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    var apply = function () {
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('uzio-theme', next); } catch (e) {}
      sync();
    };
    if (document.startViewTransition && !reduce) {
      var r = toggle.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = document.startViewTransition(apply);
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 900, easing: 'cubic-bezier(.65,0,.25,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
    } else {
      root.classList.add('theming');
      apply();
      setTimeout(function () { root.classList.remove('theming'); }, 900);
    }
  });

  /* ---------- Tabs: a liquid drop carries the colour from one tab to the next ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var activeTab = tabs[0], prevTab = null, cur = null, curColor = null, anims = [], ringTimer = 0;
  var dw = document.querySelector('.dropwrap');
  var dFrom = dw.querySelector('.d-from');
  var dHead = dw.querySelector('.d-head');
  var dBridge = dw.querySelector('.d-bridge');
  var OFF = 24;

  function geom(p) { return { l: p.offsetLeft, t: p.offsetTop, w: p.offsetWidth, h: p.offsetHeight }; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rect(cx, cy, w, h, col, off) {
    var o = { left: (cx - w / 2) + 'px', top: (cy - h / 2) + 'px', width: w + 'px', height: h + 'px' };
    if (col) o.backgroundColor = col;
    if (off != null) o.offset = off;
    return o;
  }
  function cancelDrop() {
    anims.forEach(function (a) { a.cancel(); });
    anims = [];
    clearTimeout(ringTimer);
  }

  /* The drop pulls away from the old tab, stretches a neck, and lands in the new one, shifting colour on the way. */
  function runDrop(f, g, c0, c1) {
    var D = 950;
    var fx = f.l + f.w / 2 + OFF, fy = f.t + f.h / 2 + OFF;
    var gx = g.l + g.w / 2 + OFF, gy = g.t + g.h / 2 + OFF;
    var dx = gx - fx, dy = gy - fy;
    var dist = Math.max(1, Math.hypot(dx, dy));
    var ang = Math.atan2(dy, dx) * 180 / Math.PI;
    var bh = g.h * 0.7;
    dw.style.setProperty('--c0', c0);
    dw.style.setProperty('--c1', c1);

    dBridge.style.left = fx + 'px';
    dBridge.style.top = (fy - bh / 2) + 'px';
    dBridge.style.width = dist + 'px';
    dBridge.style.height = bh + 'px';
    var rot = 'rotate(' + ang + 'deg) ';

    anims.push(dw.animate(
      [{ opacity: 0 }, { opacity: 0.92, offset: 0.06 }, { opacity: 0.92, offset: 0.78 }, { opacity: 0 }],
      { duration: D }
    ));
    anims.push(dFrom.animate([
      rect(fx, fy, f.w, f.h, c0),
      rect(lerp(fx, gx, 0.1), lerp(fy, gy, 0.1), f.h * 1.1, f.h * 0.85, c0, 0.45),
      rect(lerp(fx, gx, 0.26), lerp(fy, gy, 0.26), 4, 4, c0)
    ], { duration: D, easing: 'ease-in-out' }));
    anims.push(dBridge.animate([
      { transform: rot + 'scale(0,1)' },
      { transform: rot + 'scale(0.75,1)', offset: 0.3 },
      { transform: rot + 'scale(1,0.6)', offset: 0.65 },
      { transform: rot + 'scale(1,0)' }
    ], { duration: D, easing: 'ease-in-out' }));
    anims.push(dHead.animate([
      rect(fx, fy, f.h * 0.8, f.h * 0.8, c0),
      rect(lerp(fx, gx, 0.72), lerp(fy, gy, 0.72), g.h * 1.5, g.h * 0.88, null, 0.55),
      rect(gx, gy, g.w, g.h, c1)
    ], { duration: D, easing: 'cubic-bezier(.5,.05,.25,1.12)' }));
  }

  function moveDrop(p) {
    if (prevTab && cur) cur = geom(prevTab);
    prevTab = p;
    var g = geom(p);
    var col = p.style.getPropertyValue('--c').trim();
    cancelDrop();
    if (cur && curColor && !reduce && (cur.l !== g.l || cur.t !== g.t)) runDrop(cur, g, curColor, col);
    cur = g;
    curColor = col;
  }
  function resettle() { if (prevTab) { cur = null; moveDrop(prevTab); } }
  window.addEventListener('resize', resettle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resettle);

  /* ---------- Navigation stays fixed in the top bar ---------- */

  /* ---------- Views: gamification only ---------- */
  var views = {
    'home':    { c: '#1ea7ff', e: 'Home',    t: 'Hey Uzay 👋', p: 'Your game hub: keep your streak alive, chase XP, complete quests and unlock rewards.' },
    'play':    { c: '#ff2d75', e: 'Play',    t: 'Pick a game. Chase a new high score.', p: 'Jump into fast challenges, timed rounds, boss battles and multiplayer-style missions.' },
    'watch':   { c: '#b44dff', e: 'Watch',   t: 'Watch. Unlock. Play.', p: 'Catch short clips, trailers and strategy drops that reveal new challenges, boosts and secret rewards.' },
    'perks':   { c: '#b8ff1f', ink: '#4d6b00', e: 'Perks', t: 'Your rewards. Your status. Your collection.', p: 'Spend coins, collect badges, protect streaks and unlock cosmetic perks as you level up.' },
    'uzio-ai': { c: '#ffa11a', e: 'Uzio AI', t: 'Your AI game master is ready.', p: 'Ask Uzio to build a challenge, remix a game, raise the difficulty or surprise you with a quest.' }
  };
  var viewEl = $('view'), panel = $('panel'), curView = 'home', swapToken = 0;

  /* ---------- Helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function chip(t, c) { return '<span class="chip" style="--c:' + c + '">' + t + '</span>'; }
  function bar(p, c) { return '<div class="bar-track"' + (c ? ' style="--c:' + c + '"' : '') + '><i style="--w:' + Math.max(0, Math.min(100, p)) + '%"></i></div>'; }
  function tile(icon, title, desc, m1, m2, c, action) {
    return '<button class="tile" type="button" style="--c:' + c + '" data-act="demo" data-v="' + action + '"><span class="app-icon">' + icon + '</span><b>' + title + '</b><small>' + desc + '</small><span class="metas"><span class="mini">' + m1 + '</span><span class="mini">' + m2 + '</span></span></button>';
  }
  var ST = { saved: { 1: true } };

  /* ---------- Panels ---------- */
  function rHome() {
    return '<div class="dash">' +
      '<section class="card hero s12"><div><div class="kicker">Featured mission</div><div class="hero-title">Neon Vault</div><p class="sub">Clear 3 rounds, keep your combo alive and crack the final vault. You are 60% through.</p>' + bar(60) + '<div class="chips">' + chip('4 min left', '#fff') + chip('+120 XP', '#fff') + chip('2× combo', '#fff') + '</div></div><button class="btn white" type="button" data-act="demo" data-v="Continue Neon Vault" style="--c:var(--blue)">Continue ▶</button></section>' +
      '<div class="sec s12">Jump in <small>Every action pushes your profile forward</small></div>' +
      '<div class="s12 tiles">' +
        tile('🎮', 'Play', 'Fast rounds, boss modes and score attacks.', '2–5 min', '+ XP', 'var(--pink)', 'Open Play') +
        tile('🎁', 'Perks', 'Claim rewards, boosts and collection drops.', 'Rewards', 'Coins', 'var(--green)', 'Open Perks') +
        tile('🎬', 'Watch', 'Unlock clips, secrets and challenge drops.', 'New drops', '+ bonus', 'var(--purple)', 'Open Watch') +
        tile('✨', 'Uzio AI', 'Let Uzio create your next challenge.', 'AI game master', 'Adaptive', 'var(--orange)', 'Open Uzio AI') +
      '</div>' +
      '<section class="card s7 uzio-pick"><div class="uzio-mini"><span>U</span></div><div class="info"><div class="kicker">Uzio challenge drop</div><b>Want a 90-second boss round?</b><p class="sub">Uzio can remix your recent games into a tougher challenge with bonus XP on the line.</p><button class="btn" type="button" data-act="open-uzio" style="--c:var(--green)">Generate challenge →</button></div></section>' +
      '<section class="card s5"><h2>Daily quests <span class="hint">2 / 3 complete</span></h2>' + bar(67, 'var(--pink)') + '<div class="group" style="margin-top:16px;box-shadow:none;background:var(--fill)">' +
        '<div class="row"><span class="check">✓</span><div class="info"><b>Score Hunter</b><small>Beat one personal best</small></div></div>' +
        '<div class="row"><span class="check">✓</span><div class="info"><b>Combo Keeper</b><small>Reach a 5× combo</small></div></div>' +
        '<div class="row"><span class="check todo">○</span><div class="info"><b>Uzio Dare</b><small>Complete one AI-generated challenge</small></div></div></div></section>' +
      '<section class="card quote s12"><div><div class="kicker">Limited-time event</div><blockquote>Double XP Hour</blockquote><p class="sub">Complete any three games before the timer expires to unlock a mystery perk.</p></div><button class="btn" type="button" data-act="demo" data-v="Double XP event" style="--c:var(--purple)">Enter event →</button></section>' +
      '</div>';
  }

  function rPlay() {
    return '<div class="dash"><div class="sec s12">Game modes <small>Choose your route or let Uzio randomize it</small></div><div class="s12 tiles">' +
      tile('⚡', 'Rapid Fire', 'Answer, react and build a combo before time runs out.', '90 sec', 'Score attack', 'var(--blue)', 'Rapid Fire') +
      tile('👾', 'Boss Battle', 'Survive three stages and defeat the final boss.', '5 min', '+180 XP', 'var(--orange)', 'Boss Battle') +
      tile('🧩', 'Puzzle Drop', 'Solve a chain of clues with fewer hints for more points.', '3 min', 'Logic', 'var(--purple)', 'Puzzle Drop') +
      tile('🎯', 'Perfect Run', 'One mistake resets the multiplier. How far can you go?', 'Hard', 'Combo', 'var(--green)', 'Perfect Run') +
      tile('🏁', 'Beat Uzio', 'Race Uzio to the answer and steal the bonus.', '2 min', 'AI duel', 'var(--teal)', 'Beat Uzio') +
      tile('💥', 'Risk It', 'Choose the safer reward or gamble your points for more.', 'High stakes', 'Coins', 'var(--pink)', 'Risk It') +
      tile('🗺️', 'Quest Run', 'Clear connected mini-games to reach the final chest.', '6–8 min', 'Adventure', 'var(--indigo)', 'Quest Run') +
      tile('🎲', 'Surprise Me', 'No choosing. Uzio picks the mode, rule and difficulty.', 'Random', 'Bonus XP', 'var(--orange)', 'Surprise Me') +
      '</div></div>';
  }

  function rWatch() {
    var vids = [
      [1, '🏆', 'How top players protect a streak', 'Strategy Drop · 2:10', 'var(--pink)'],
      [2, '👾', 'Boss Battle: new mode reveal', 'Mode Trailer · 1:35', 'var(--teal)'],
      [3, '⚡', '3 tricks for a higher combo', 'Quick Tip · 2:20', 'var(--blue)'],
      [4, '🎁', 'Mystery Perks explained', 'Reward Drop · 2:05', 'var(--green)'],
      [5, '🗺️', 'Inside the new Quest Run map', 'Preview · 3:15', 'var(--purple)'],
      [6, '🤖', 'Uzio AI creates an impossible challenge', 'Uzio Lab · 2:50', 'var(--orange)']
    ];
    var grid = vids.map(function (v, i) {
      var on = !!ST.saved[v[0]];
      return '<article style="--c:' + v[4] + '"><button class="thumb" type="button" data-act="demo" data-v="Watch: ' + v[2] + '" aria-label="Play ' + v[2] + '"><span class="emo">' + v[1] + '</span><span class="play">▶</span>' + (i < 2 ? '<span class="new">NEW</span>' : '') + '</button><div class="vmeta"><div><h3>' + v[2] + '</h3><span class="sub">' + v[3] + '</span></div><button class="star' + (on ? ' on' : '') + '" type="button" data-act="save" data-id="' + v[0] + '" aria-pressed="' + on + '" aria-label="Save for later">' + (on ? '★' : '☆') + '</button></div></article>';
    }).join('');
    return '<div class="dash"><div class="sec s12">Watch drops <small>Some clips unlock quests, boosts or secret game modes</small></div><div class="s12 vgrid">' + grid + '</div></div>';
  }

  function ringSvg(pct) {
    var C = 2 * Math.PI * 52, off = C * (1 - pct / 100);
    return '<div class="ring"><svg viewBox="0 0 132 132"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--orange)"/><stop offset="1" stop-color="var(--pink)"/></linearGradient></defs><circle class="tr" cx="66" cy="66" r="52"/><circle class="pr" cx="66" cy="66" r="52" stroke="url(#rg)" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" data-off="' + off.toFixed(1) + '"/></svg><div class="mid"><b>7</b><span>LEVEL</span></div></div>';
  }

  function rPerks() {
    var perks = [
      ['🛡️', 'Streak Shield', 'Protect one missed day', 'var(--blue)', '120 coins'],
      ['⚡', 'XP Booster', 'Earn 2× XP for 20 minutes', 'var(--orange)', '180 coins'],
      ['🎲', 'Reroll Token', 'Swap one daily quest instantly', 'var(--purple)', '90 coins'],
      ['💎', 'Rare Drop', 'Unlock a random premium cosmetic', 'var(--teal)', '250 coins'],
      ['🔥', 'Combo Saver', 'Keep your multiplier after one mistake', 'var(--pink)', '160 coins']
    ];
    var cards = perks.map(function (b, i) {
      return '<div class="badge perk-item" style="--c:' + b[3] + '"><div class="coin">' + b[0] + '</div><b>' + b[1] + '</b><small>' + b[2] + '</small>' + chip(b[4], b[3]) + '</div>';
    }).join('');
    return '<div class="dash">' +
      '<section class="card s5 lvl">' + ringSvg(78) + '<div class="info"><div class="kicker">Player status</div><div class="big">2,340 XP</div><p class="sub">660 XP to Level 8</p></div></section>' +
      '<section class="card s7"><h2>Wallet <span class="hint">Spend or save</span></h2><div class="big">🪙 640 coins</div><p class="sub">Earn coins from quests, high scores, streak milestones and special events.</p><div class="chips">' + chip('🔥 4-day streak', 'var(--pink)') + chip('🏆 12 badges', 'var(--orange)') + chip('💎 3 rare items', 'var(--purple)') + '</div></section>' +
      '<div class="sec s12">Perk shop <small>Boosts and collectibles rotate regularly</small></div>' +
      '<section class="s12 badges">' + cards + '</section>' +
      '<section class="card s12"><h2>Next unlock <span class="hint">Level 8</span></h2><p class="q">Mystery Profile Aura</p>' + bar(78, 'var(--green)') + '<div class="chips">' + chip('660 XP to go', 'var(--green)') + chip('✨ Cosmetic reward', 'var(--purple)') + '</div></section>' +
      '</div>';
  }

  function rUzioAI() {
    return '<div class="dash">' +
      '<section class="card hero s12"><div><div class="kicker">Uzio AI · Game Master</div><div class="hero-title">Tell me how you want to play.</div><p class="sub">I can invent a challenge, remix a game, set a handicap, create a boss round or build a quest around your current streak.</p><div class="chips">' + chip('Adaptive difficulty', '#fff') + chip('Fresh rules', '#fff') + chip('Bonus objectives', '#fff') + '</div></div><button class="btn white" type="button" data-act="demo" data-v="Generate AI challenge" style="--c:var(--orange)">Generate challenge</button></section>' +
      '<section class="card s7"><h2>Quick prompts <span class="hint">Tap to send to Uzio</span></h2><div class="suggest"><button type="button" data-act="open-uzio">“Give me a 2-minute challenge with a huge combo bonus.”</button><button type="button" data-act="open-uzio">“Turn my weakest game into a boss battle.”</button><button type="button" data-act="open-uzio">“Surprise me with a risky quest for 200 XP.”</button><button type="button" data-act="open-uzio">“Make a head-to-head challenge I can play with a friend.”</button></div></section>' +
      '<section class="card s5"><div class="uzio-pick"><div class="uzio-mini"><span>U</span></div><div><div class="kicker">Live modifier</div><b>Difficulty: Spicy 🌶️</b><p class="sub">Uzio is ready to adjust timers, hints, multipliers and rewards while you play.</p></div></div><div class="chips">' + chip('+25% XP', 'var(--orange)') + chip('Fewer hints', 'var(--pink)') + chip('Faster timer', 'var(--purple)') + '</div></section>' +
      '<div class="sec s12">Uzio can also… <small>Build the rules around you</small></div>' +
      '<div class="s12 tiles">' +
        tile('🧪', 'Remix', 'Combine two game modes into one new challenge.', 'AI', 'Experimental', 'var(--teal)', 'Uzio Remix') +
        tile('👾', 'Create a Boss', 'Generate a multi-stage boss with escalating rules.', 'Boss', '+ XP', 'var(--orange)', 'Create Boss') +
        tile('🗺️', 'Build a Quest', 'Turn several games into a connected adventure.', 'Quest', 'Rewards', 'var(--purple)', 'Build Quest') +
        tile('⚖️', 'Balance It', 'Tune a challenge so it feels fair but exciting.', 'Adaptive', 'Smart', 'var(--green)', 'Balance It') +
      '</div></div>';
  }

  var RENDER = { 'home': rHome, 'play': rPlay, 'watch': rWatch, 'perks': rPerks, 'uzio-ai': rUzioAI };

  function renderPanel(id, quiet) {
    curView = id;
    panel.classList.toggle('quiet', !!quiet);
    panel.innerHTML = (RENDER[id] || rHome)();
    applyLanguage(panel);
    Array.prototype.forEach.call(panel.querySelectorAll('.dash > *'), function (el, i) { el.style.animationDelay = (Math.min(i, 8) * 35) + 'ms'; });
    var pr = panel.querySelector('.ring .pr');
    if (pr) requestAnimationFrame(function () { requestAnimationFrame(function () { pr.style.strokeDashoffset = pr.getAttribute('data-off'); }); });
  }

  var firstShow = true;
  function swapContent(id, v) {
    var token = ++swapToken;
    var apply = function () {
      if (token !== swapToken) return;
      panel.style.minHeight = '';
      renderPanel(id);
      $('eyebrow').textContent = translateString(v.e); $('title').textContent = translateString(v.t); $('blurb').textContent = translateString(v.p);
      viewEl.classList.remove('swap'); void viewEl.offsetWidth; viewEl.classList.add('swap');
      panel.classList.remove('is-out'); viewEl.classList.remove('is-out');
    };
    if (firstShow || reduce) { firstShow = false; apply(); return; }
    panel.style.minHeight = panel.offsetHeight + 'px'; /* keeps the page height steady while content swaps */
    panel.classList.add('is-out'); viewEl.classList.add('is-out');
    setTimeout(apply, 200);
  }

  function show(id) {
    if (!views[id]) id = 'home';
    var v = views[id];
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-view') === id;
      if (on) { t.setAttribute('aria-current', 'page'); activeTab = t; } else t.removeAttribute('aria-current');
    });
    root.style.setProperty('--accent', v.c);
    if (v.ink) root.style.setProperty('--accent-ink', v.ink); else root.style.removeProperty('--accent-ink');
    moveDrop(activeTab);
    swapContent(id, v);
    document.title = v.e === 'Home' ? 'Uzio' : translateString(v.e) + ' · Uzio';
  }

  /* ---------- Interactions ---------- */
  tabs.forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      var id = t.getAttribute('data-view');
      if (location.hash !== '#' + id) location.hash = id; else show(id);
    });
  });
  document.querySelector('.brand').addEventListener('click', function (e) { e.preventDefault(); location.hash = 'home'; });

  panel.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var act = b.getAttribute('data-act'), v = b.getAttribute('data-v'), id = +b.getAttribute('data-id');
    if (act === 'demo') { toast('✨ ' + v + ' · activity ready to connect'); return; }
    if (act === 'open-uzio') {
      if (window.UzioAI) { window.UzioAI.open(b.closest('.suggest') ? b.textContent.replace(/[“”"]/g, '').trim() : ''); return; }
      location.hash = 'uzio-ai'; return;
    }
    if (act === 'save') {
      if (ST.saved[id]) delete ST.saved[id]; else ST.saved[id] = true;
      renderPanel(curView, true);
    }
  });

  /* ---------- Profile + onboarding ---------- */
  var LEVELS = [
    { id: 'start', e: '🌱', t: 'Casual', s: 'I like quick, easy-to-enter challenges.', fit: 'quick and friendly' },
    { id: 'grow',  e: '🚀', t: 'Competitive', s: 'I like chasing scores, streaks and harder goals.', fit: 'a good stretch' },
    { id: 'conf',  e: '🏆', t: 'Hardcore', s: 'Give me tough rules, high stakes and rare rewards.', fit: 'seriously challenging' }
  ];
  var INTERESTS = [['⚡', 'Speed'], ['🧩', 'Puzzles'], ['🏁', 'Competition'], ['👾', 'Bosses'], ['🗺️', 'Quests'], ['🎁', 'Rewards'], ['🔥', 'Streaks'], ['🤖', 'AI'], ['🎯', 'High Scores']];
  var PKEY = 'uzio-profile';
  var P = { name: 'Uzay', level: '', interests: [] };
  var seen = false, hasProfile = false;

  (function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(PKEY)); } catch (e) {}
    if (!s || typeof s !== 'object') return;
    seen = !!s.done;
    if (typeof s.name === 'string' && s.name.trim()) {
      hasProfile = true;
      P.name = s.name.trim().slice(0, 20);
      if (LEVELS.some(function (l) { return l.id === s.level; })) P.level = s.level;
      if (Array.isArray(s.interests)) P.interests = s.interests.filter(function (n) { return INTERESTS.some(function (i) { return i[1] === n; }); }).slice(0, 3);
    }
  })();

  function saveP() {
    try { localStorage.setItem(PKEY, JSON.stringify({ done: true, name: hasProfile ? P.name : '', level: P.level, interests: P.interests })); } catch (e) {}
  }
  function joinList(a) {
    a = a.map(function (x) { return x.toLowerCase(); });
    return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  }
  /* the "Uzio picked this for you" line on Home */
  function pickLine() {
    var lv = LEVELS.filter(function (l) { return l.id === P.level; })[0], t;
    if (P.interests.length && lv) t = 'Because you like ' + joinList(P.interests) + ', I picked words from your world. Today\'s set is ' + lv.fit + '.';
    else if (P.interests.length) t = 'Because you like ' + joinList(P.interests) + ', I picked words from your world.';
    else if (lv) t = 'I picked a set that is ' + lv.fit + ' for you.';
    else t = 'You were strong on yesterday\'s words, so I made this one a little harder.';
    return '<p class="sub">' + t + '</p>';
  }
  function applyProfile() {
    views.home.t = 'Hey ' + P.name + ' 👋';
    $('menuName').textContent = P.name;
    $('menuAvatar').textContent = P.name.charAt(0).toUpperCase();
    if (!firstShow && curView === 'home') { $('title').textContent = views.home.t; renderPanel('home', true); }
  }
  applyProfile();

  var onb = $('onb'), onbBody = $('onbBody'), onbLeft = $('onbLeft'), onbRight = $('onbRight'), onbDots = $('onbDots');
  var onbStep = 0, draft = { name: '', level: '', interests: [] }, onbFrom = null;
  var behind = [$('bar'), document.querySelector('main'), document.querySelector('.uzio-orb'), $('backTop')];
  function setBehind(on) { behind.forEach(function (el) { if (el) el.inert = on; }); }

  function onbRender() {
    var s = onbStep, h = '', nm = esc(draft.name.trim());
    if (s === 0) {
      h = '<h2 class="onb-title" id="onbTitle">Hi! I\'m Uzio.</h2><p class="onb-sub">I\'ll help you practise English. What should I call you?</p>' +
        '<input class="onb-input" id="onbName" type="text" maxlength="20" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Your name" aria-label="Your name" value="' + esc(draft.name) + '">';
    } else if (s === 1) {
      h = '<h2 class="onb-title" id="onbTitle">Nice to meet you, ' + nm + '!</h2><p class="onb-sub">How do you like to play?</p><div class="onb-choices" role="group" aria-label="Play style">' +
        LEVELS.map(function (l) {
          return '<button class="opt" type="button" data-level="' + l.id + '" aria-pressed="' + (draft.level === l.id) + '"><span class="e">' + l.e + '</span><span><b>' + l.t + '</b><small>' + l.s + '</small></span></button>';
        }).join('') + '</div>';
    } else if (s === 2) {
      h = '<h2 class="onb-title" id="onbTitle">What do you like?</h2><p class="onb-sub">Pick up to 3. I\'ll use them in your practice.</p><div class="onb-chips" role="group" aria-label="Interests">' +
        INTERESTS.map(function (i) {
          return '<button class="pick" type="button" data-int="' + i[1] + '" aria-pressed="' + (draft.interests.indexOf(i[1]) > -1) + '">' + i[0] + ' ' + i[1] + '</button>';
        }).join('') + '</div>';
    } else {
      h = '<h2 class="onb-title" id="onbTitle">All set, ' + nm + '! 🎉</h2><p class="onb-sub">Your game hub is ready. You can redo this any time from the menu.</p>';
    }
    onbBody.innerHTML = '<div class="onb-step">' + h + '</div>';
    applyLanguage(onbBody);
    onbLeft.innerHTML = s === 0
      ? '<button class="onb-skip" type="button" data-onb="skip">Skip for now</button>'
      : '<button class="onb-skip" type="button" data-onb="back">Back</button>';
    onbRight.innerHTML = s === 3
      ? '<button class="btn" type="button" data-onb="finish">Let\'s go →</button>'
      : '<button class="btn" type="button" data-onb="next" id="onbNext"' + (s === 0 && !draft.name.trim() ? ' disabled' : '') + '>Next</button>';
    Array.prototype.forEach.call(onbDots.children, function (d, i) { d.classList.toggle('on', i === s); });
    setTimeout(function () {
      var f = onbBody.querySelector('input, .opt, .pick') || onb.querySelector('[data-onb="finish"], [data-onb="next"]');
      if (f) f.focus({ preventScroll: true });
    }, 60);
  }

  function openOnb(from) {
    setMenu(false);
    onbFrom = from || null;
    draft = { name: hasProfile ? P.name : '', level: P.level, interests: P.interests.slice() };
    onbStep = 0;
    onbRender();
    setBehind(true); onb.inert = false;
    onb.classList.add('show');
  }
  function closeOnb(commit) {
    if (commit) {
      P.name = draft.name.trim().slice(0, 20) || P.name;
      hasProfile = true;
      P.level = draft.level;
      P.interests = draft.interests.slice();
    }
    seen = true; saveP();
    onb.classList.remove('show'); onb.inert = true; setBehind(false);
    if (commit) { applyProfile(); toast('Welcome, ' + P.name + '! ✨'); }
    var f = onbFrom; onbFrom = null;
    if (f && f.focus) f.focus({ preventScroll: true });
  }

  onb.addEventListener('click', function (e) {
    var t = e.target.closest('[data-onb], [data-level], [data-int]');
    if (!t) return;
    if (t.hasAttribute('data-level')) {
      draft.level = t.getAttribute('data-level');
      Array.prototype.forEach.call(onbBody.querySelectorAll('[data-level]'), function (b) { b.setAttribute('aria-pressed', String(b === t)); });
      return;
    }
    if (t.hasAttribute('data-int')) {
      var n = t.getAttribute('data-int'), i = draft.interests.indexOf(n);
      if (i > -1) draft.interests.splice(i, 1);
      else if (draft.interests.length >= 3) { toast('Pick up to 3 ✨'); return; }
      else draft.interests.push(n);
      t.setAttribute('aria-pressed', String(draft.interests.indexOf(n) > -1));
      return;
    }
    var a = t.getAttribute('data-onb');
    if (a === 'next') { if (onbStep === 0 && !draft.name.trim()) return; onbStep++; onbRender(); }
    else if (a === 'back') { onbStep--; onbRender(); }
    else if (a === 'skip') closeOnb(false);
    else if (a === 'finish') closeOnb(true);
  });
  onb.addEventListener('input', function (e) {
    if (e.target.id !== 'onbName') return;
    draft.name = e.target.value;
    var nx = $('onbNext'); if (nx) nx.disabled = !draft.name.trim();
  });
  onb.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id === 'onbName') {
      e.preventDefault();
      var nx = $('onbNext'); if (nx && !nx.disabled) nx.click();
    } else if (e.key === 'Escape') closeOnb(false);
  });
  $('replayOnb').addEventListener('click', function () { openOnb(acctBtn); });
  if (!seen) setTimeout(function () { openOnb(null); }, 900); /* first visit: let the page appear, then say hi */

  /* ---------- Tilt cards: tiles and video thumbnails lean toward the pointer ---------- */
  var tiltEl = null;
  function tiltOff(el) {
    el.classList.remove('tilting');
    ['--rx', '--ry', '--gx', '--gy', '--px', '--py'].forEach(function (p) { el.style.removeProperty(p); });
  }
  panel.addEventListener('pointermove', function (e) {
    if (reduce || e.pointerType === 'touch') return;
    var el = e.target.closest('.tile, .thumb');
    if (el !== tiltEl) { if (tiltEl) tiltOff(tiltEl); tiltEl = el; }
    if (!el) return;
    var r = el.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    var max = el.classList.contains('thumb') ? 7 : 9;
    el.classList.add('tilting');
    el.style.setProperty('--ry', ((x - .5) * 2 * max).toFixed(2) + 'deg');
    el.style.setProperty('--rx', ((.5 - y) * 2 * max).toFixed(2) + 'deg');
    el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    el.style.setProperty('--px', ((x - .5) * 2).toFixed(2));
    el.style.setProperty('--py', ((y - .5) * 2).toFixed(2));
  });
  panel.addEventListener('pointerleave', function () { if (tiltEl) { tiltOff(tiltEl); tiltEl = null; } });

  /* ---------- Uzio orb: raw WebGL, no libraries ---------- */
  (function () {
    var link = document.querySelector('.uzio-orb');
    var cv = document.getElementById('uzioOrb');
    if (!link || !cv) return;
    var gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) { link.classList.add('no-gl'); return; }

    var VS = 'attribute vec2 a;varying vec2 vUv;void main(){vUv=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
    var FS = [
'precision highp float;',
'uniform vec2 uRes;uniform float uTime;uniform vec2 uGaze;uniform float uBlink;uniform float uHappy;uniform float uSpin;uniform float uDark;',
'varying vec2 vUv;',
'const vec3 C0=vec3(.118,.655,1.);const vec3 C1=vec3(1.,.176,.459);const vec3 C2=vec3(.722,1.,.122);',
'const vec3 C3=vec3(.706,.302,1.);const vec3 C4=vec3(1.,.631,.102);',
'const vec3 D0=vec3(.16,.56,1.);const vec3 D1=vec3(1.,.3,.54);const vec3 D2=vec3(.3,.82,.4);',
'const vec3 D3=vec3(.66,.36,1.);const vec3 D4=vec3(1.,.66,.16);',
'vec3 field(vec3 s,float t,out float ws){',
'  vec3 acc=vec3(0.);ws=0.;',
'  for(int i=0;i<5;i++){',
'    float fi=float(i);',
'    vec3 c=.58*vec3(sin(t*.55+fi*1.26+.3),cos(t*.47+fi*2.1),sin(t*.63+fi*.93+1.1));',
'    vec3 d=s-c;float w=exp(-dot(d,d)*3.0);',
'    vec3 cn=i==0?C0:(i==1?C1:(i==2?C2:(i==3?C3:C4)));',
'    vec3 cl=i==0?D0:(i==1?D1:(i==2?D2:(i==3?D3:D4)));',
'    vec3 col=mix(cl,cn,uDark);',
'    acc+=col*w;ws+=w;',
'  }',
'  return acc;',
'}',
'void main(){',
'  vec2 p=vUv*2.-1.;',
'  float t=uTime;',
'  float R=.74*(1.+.012*sin(t*1.7));',
'  float r=length(p);',
'  float aa=3./uRes.y;',
'  float ws;',
'  vec3 hacc=field(vec3(p/R*.62,0.),t,ws);',
'  vec3 hcol=hacc/(ws+.2);',
'  float halo=exp(-max(r-R,0.)*7.5)*mix(.3,.36,uDark)*smoothstep(0.,.25,ws+.15)*smoothstep(.98,.8,r);',
'  vec3 outc=hcol*halo;float outa=halo*.8;',
'  float edge=1.-smoothstep(R-aa,R+aa,r);',
'  if(edge<=0.){gl_FragColor=vec4(outc,outa);return;}',
'  vec2 q=p/R;float rr=min(length(q),1.);float z=sqrt(max(1.-rr*rr,0.));',
'  vec3 n=vec3(q,z);',
'  vec3 s=vec3(q*.95,z*.55-.25);s.xy+=n.xy*.12*sin(t*.8);',
'  float cs=cos(uSpin),sn=sin(uSpin);s.xz=vec2(cs*s.x+sn*s.z,-sn*s.x+cs*s.z);',
'  vec3 acc=field(s,t,ws);',
'  vec3 inner=acc/(ws+.16);',
'  float glow=clamp(ws,0.,1.5);',
'  vec3 base=mix(mix(vec3(.50,.58,.92),vec3(.10,.12,.32),uDark),inner,smoothstep(0.,.8,glow));',
'  vec3 c=base*(.78+.5*pow(z,.8))+inner*.12*glow;',
'  float fres=pow(1.-z,2.4);',
'  c=mix(c,mix(mix(inner*.85,vec3(1.),.3),mix(vec3(1.),inner,.45),uDark),fres*.6);',
'  c=mix(c,vec3(dot(c,vec3(.3,.59,.11))),.22);',
'  c=mix(c,vec3(.80,.83,.96),mix(.1,.2,uDark));',
'  vec3 f=normalize(vec3(uGaze.x*.62,uGaze.y*.5,1.));f=vec3(cs*f.x+sn*f.z,f.y,-sn*f.x+cs*f.z);',
'  vec3 rt=normalize(cross(vec3(0.,1.,0.),f));vec3 up=cross(f,rt);',
'  float u=dot(n,rt),v=dot(n,up),w=dot(n,f);',
'  float fm=smoothstep(.12,.42,w);',
'  vec3 ink=vec3(.055,.065,.16);',
'  float bl=max(uBlink,.07);',
'  for(int k=0;k<2;k++){',
'    float sx=k==0?-1.:1.;',
'    vec2 b=vec2(u-sx*.46,v+.045)/vec2(.115,.068);',
'    c=mix(c,vec3(1.,.38,.55),exp(-dot(b,b)*1.1)*.55*fm);',
'  }',
'  for(int k=0;k<2;k++){',
'    float sx=k==0?-1.:1.;',
'    vec2 e=vec2(u-sx*.29,v-.105);',
'    float d=length(e/vec2(.098,.145*bl));',
'    float ea=smoothstep(1.,.88,d)*fm;',
'    c=mix(c,ink,ea);',
'    float h1=smoothstep(1.,.6,length((e-vec2(-.024,.052*bl))/vec2(.034,.034*bl+.001)));',
'    float h2=smoothstep(1.,.6,length((e-vec2(.03,-.05*bl))/vec2(.017,.017*bl+.001)));',
'    c=mix(c,vec3(1.),max(h1,h2*.85)*ea*smoothstep(.2,.6,bl));',
'  }',
'  vec2 m=vec2(u,v+.185);',
'  float s1=m.x/.125;',
'  float line=smoothstep(.019,.011,abs(m.y-(.03*s1*s1-.03)))*smoothstep(1.,.82,abs(s1));',
'  vec2 me=m-vec2(0.,-.035);',
'  float od=length(me/vec2(.07+.02*uHappy,.012+.06*uHappy));',
'  float open=smoothstep(1.,.86,od);',
'  float mk=mix(line,open,smoothstep(.12,.5,uHappy))*fm;',
'  c=mix(c,ink,mk);',
'  float tongue=open*smoothstep(.1,.5,uHappy)*smoothstep(-.012,-.04,me.y)*fm;',
'  c=mix(c,vec3(1.,.42,.58),tongue);',
'  c+=vec3(1.)*smoothstep(1.,0.,length((q-vec2(-.4,.5))/vec2(.3,.14)))*.6;',
'  c+=vec3(1.)*smoothstep(1.,0.,length((q-vec2(.42,-.55))/vec2(.2,.06)))*.22;',
'  c=clamp(c,0.,1.);',
'  vec3 rgb=outc*(1.-edge)+c*edge;',
'  float a=outa*(1.-edge)+edge;',
'  gl_FragColor=vec4(rgb,a);',
'}'
    ].join('\n');

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { link.classList.add('no-gl'); return; }
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { link.classList.add('no-gl'); return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uTime', 'uGaze', 'uBlink', 'uHappy', 'uSpin', 'uDark'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    gl.clearColor(0, 0, 0, 0);

    function fit() {
      var d = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(cv.clientWidth * d);
      if (w && cv.width !== w) { cv.width = w; cv.height = w; }
      gl.viewport(0, 0, cv.width, cv.height);
    }
    window.addEventListener('resize', fit);
    fit();

    /* cursor tracking: the face turns toward the pointer anywhere on the page */
    var px = null, py = null, lastMove = 0, hov = 0, hovT = 0, press = 0;
    window.addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; lastMove = performance.now(); }, { passive: true });
    window.addEventListener('pointerdown', function (e) { px = e.clientX; py = e.clientY; lastMove = performance.now(); }, { passive: true });
    link.addEventListener('pointerenter', function () {
      hovT = 1;
      /* someone showed up: a hat politely pops off instead of staying on */
      if (mv && mv.n === 'hat' && (performance.now() - mv.t0) / MOVES.hat.d < .86) mv.t0 = performance.now() - MOVES.hat.d * .88;
    });
    link.addEventListener('pointerleave', function () { hovT = 0; });
    link.addEventListener('focus', function () { hovT = 1; });
    link.addEventListener('blur', function () { hovT = 0; });
    link.addEventListener('click', function () { press = 1; }); /* happy burst, then the link opens Uzio's Room */

    var body = document.getElementById('orbBody');
    var hatEl = document.getElementById('orbHat');
    var hatOn = false;

    /* Funny hats, drawn in a 128-unit box: the sphere's top sits near y=17, centred on x=64 */
    var HATS = {
      party: `<svg viewBox="0 0 128 128"><g transform="rotate(-11 64 28)"><path d="M43 29 L64 -6 L85 29 Z" fill="#ff2d55"/><polygon points="51.4,15 76.6,15 80.8,22 47.2,22" fill="#ffd60a"/><circle cx="61" cy="5" r="2" fill="#fff"/><circle cx="67" cy="9" r="1.7" fill="#fff"/><ellipse cx="64" cy="29" rx="22" ry="4.5" fill="#ff9f0a"/><circle cx="64" cy="-6" r="6" fill="#ffd60a"/></g></svg>`,
      wizard: `<svg viewBox="0 0 128 128"><g transform="rotate(8 64 28)"><path d="M41 30 L61 -16 Q67 -20 70 -8 L87 30 Z" fill="#5e5ce6"/><ellipse cx="64" cy="30" rx="27" ry="5.5" fill="#4442c4"/><circle cx="58" cy="12" r="2.4" fill="#ffd60a"/><circle cx="69" cy="18" r="1.9" fill="#ffd60a"/><circle cx="63" cy="0" r="1.6" fill="#fff"/></g></svg>`,
      crown: `<svg viewBox="0 0 128 128"><g transform="rotate(-6 64 28)"><path d="M43 29 L44 5 L55 16 L64 0 L73 16 L84 5 L85 29 Z" fill="#ffcc00" stroke="#e29a00" stroke-width="1.5" stroke-linejoin="round"/><rect x="43" y="23" width="42" height="6.5" rx="2" fill="#f0a000"/><circle cx="44" cy="5" r="2.8" fill="#ff375f"/><circle cx="64" cy="0" r="3" fill="#ff375f"/><circle cx="84" cy="5" r="2.8" fill="#ff375f"/><circle cx="53" cy="26.2" r="2.2" fill="#0a84ff"/><circle cx="64" cy="26.2" r="2.2" fill="#30d158"/><circle cx="75" cy="26.2" r="2.2" fill="#bf5af2"/></g></svg>`,
      propeller: `<svg viewBox="0 0 128 128"><g transform="rotate(7 64 28)"><path d="M42 30 Q42 9 64 9 Q86 9 86 30 Z" fill="#30b0c7"/><path d="M64 9 L64 30 M53 11 Q50 20 51 30 M75 11 Q78 20 77 30" stroke="#1e8aa0" stroke-width="1.4" fill="none"/><rect x="40" y="28" width="48" height="5.5" rx="2.7" fill="#ff375f"/><rect x="62.5" y="3" width="3" height="7" fill="#555"/><circle cx="64" cy="9" r="2.6" fill="#ffd60a"/><g class="prop"><ellipse cx="64" cy="3" rx="21" ry="3" fill="#ff9f0a"/></g></g></svg>`,
      chef: `<svg viewBox="0 0 128 128"><defs><g id="chefg"><circle cx="49" cy="15" r="10"/><circle cx="64" cy="9" r="12"/><circle cx="79" cy="15" r="10"/><rect x="47" y="15" width="34" height="14"/></g></defs><g transform="rotate(-5 64 28)"><use href="#chefg" fill="#fff" stroke="#cfcfd8" stroke-width="3.2" stroke-linejoin="round"/><use href="#chefg" fill="#fff"/><path d="M56 17 V27 M64 14 V27 M72 17 V27" stroke="#e3e3ea" stroke-width="1.4"/><rect x="45" y="27" width="38" height="6" rx="3" fill="#f2f2f7" stroke="#cfcfd8" stroke-width="1"/></g></svg>`
    };
    var HAT_NAMES = ['party', 'wizard', 'crown', 'propeller', 'chef'], lastHat = '';

    var dk = isDark() ? 1 : 0; /* 0 = light theme, 1 = dark theme; eases when the theme changes */
    var gx = 0, gy = 0, blinkAt = 1800, blinkStart = -1, last = performance.now(), T = reduce ? 3 : 0;
    var ease = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var c01 = function (x) { return Math.max(0, Math.min(1, x)); };
    var PI = Math.PI, sin = Math.sin;

    /* Little moves. Each one tweaks the orb for progress ph (0..1) through the object o. */
    var MOVES = {
      spin:   { d: 1050, f: function (ph, o, m) { o.spin = m.dir * PI * 2 * ease(ph); o.jy = -15 * sin(PI * c01(ph * 1.05)); o.sy = 1 + .07 * sin(PI * ph); o.sx = 1 - .04 * sin(PI * ph); o.happy = .8 * sin(PI * ph); } },
      wiggle: { d: 900,  f: function (ph, o) { o.rot = 10 * sin(ph * PI * 6) * (1 - ph); o.happy = .55 * sin(PI * ph); } },
      yawn:   { d: 2300, f: function (ph, o) { var b = c01(sin(PI * ph) * 2.2); o.blink = 1 - .93 * b; o.happy = b; o.sy = 1 + .05 * b; o.sx = 1 - .03 * b; o.gyo = .25 * b; } },
      look:   { d: 2800, f: function (ph, o) { o.gx = sin(ph * PI * 2) * .95; o.gy = .25 * sin(ph * PI * 4) + .1; } },
      bounce: { d: 1200, f: function (ph, o) { var a = Math.abs(sin(ph * PI * 2)); o.jy = -13 * a; o.sy = 1 + .06 * a - .05 * (1 - a) * sin(PI * ph); o.sx = 1 - (o.sy - 1) * .6; o.happy = .6 * sin(PI * ph); } },
      /* giggle fit: eyes squeezed, mouth wide open, little shakes */
      laugh:  { d: 2400, f: function (ph, o) {
        var env = Math.min(1, ph * 8, (1 - ph) * 5), t = ph * PI * 2 * 5;
        o.happy = env; o.blink = 1 - .55 * env;
        o.jy = -5 * Math.abs(sin(t)) * env;
        o.rot = 5 * sin(ph * PI * 14) * env;
        o.sy = 1 + .05 * sin(t) * env; o.sx = 1 - (o.sy - 1) * .6;
      } },
      /* loses its balance: wobbles, looks up, rolls backwards, then rocks back to its feet */
      tipover: { d: 3400, f: function (ph, o) {
        var rot = 0, jx = 0, jy = 0, happy = 0, gy = 0;
        if (ph < .24) {
          var a = ph / .24;
          rot = 7 * sin(a * PI * 3) * a; happy = .15 * a; gy = .6 * a;
        } else if (ph < .52) {
          var b = (ph - .24) / .28, e = ease(b);
          rot = -62 * e; jx = -30 * e; jy = -6 * sin(PI * b);
          happy = .15 + .55 * c01(b * 4); gy = .6 + .3 * b;
        } else {
          var u = (ph - .52) / .48, dmp = Math.exp(-4.2 * u), cs2 = Math.cos(u * PI * 3.2);
          rot = -62 * dmp * cs2; jx = -30 * dmp * cs2;
          jy = -9 * Math.abs(sin(u * PI * 2.4)) * (1 - u);
          happy = c01(.7 + .2 * sin(u * PI * 6) - u * .6); gy = .9 * (1 - u);
          o.sy = 1 - .06 * Math.abs(sin(u * PI * 2.4)) * (1 - u); o.sx = 1 + (1 - o.sy) * .6;
        }
        o.rot = rot; o.jx = jx; o.jy += jy; o.happy = happy; o.gx = 0; o.gy = gy;
      } },
      /* a hat drops in, bounces on, gets a laugh and a wiggle, then pops off */
      hat:    { d: 6400, f: function (ph, o) {
        var h = { x: 0, y: 0, r: 0, a: 1 }, land = .1, out = .88;
        if (ph < land) {
          var p = ph / land;
          h.y = -90 * (1 - p * p); h.r = -30 * (1 - p); h.a = c01(p * 3);
          o.gx = 0; o.gy = .85;
        } else if (ph < land + .08) {
          var q = (ph - land) / .08;
          h.y = 5 * sin(q * PI); o.sy = 1 - .07 * sin(q * PI); o.sx = 1 + .04 * sin(q * PI); o.happy = .75 * q;
          o.gx = 0; o.gy = .85 * (1 - q * .6);
        } else if (ph < out) {
          var t = (ph - land - .08) / (out - land - .08);
          h.r = 4 * sin(t * PI * 6);
          o.rot = 3 * sin(t * PI * 5);
          o.happy = .6 + .3 * sin(t * PI * 4);
          if (t > .3 && t < .55) { /* giggle while wearing it */
            var g = sin((t - .3) / .25 * PI);
            o.happy = 1; o.blink = 1 - .5 * g; o.jy = -4 * Math.abs(sin(t * PI * 18)) * g;
            o.rot = 5 * sin(t * PI * 26) * g; h.r = 7 * sin(t * PI * 26) * g;
          } else o.jy = -2 * Math.abs(sin(t * PI * 3));
        } else {
          var w = (ph - out) / (1 - out);
          h.y = -110 * ease(w); h.r = 240 * w; h.a = 1 - c01((w - .5) * 2); o.happy = .6 * (1 - w);
        }
        o.hat = h;
      } },
      sleepy: { d: 3200, f: function (ph, o) { var s = sin(PI * ph); o.blink = 1 - .88 * s * s; o.gyo = -.45 * s; o.rot = 4 * sin(ph * PI * 2) * s; } }
    };
    var BORED = ['wiggle', 'yawn', 'look', 'bounce', 'sleepy', 'laugh', 'laugh', 'tipover'];
    var mv = null, lastBored = '';
    var nextSpin = last + 10000 + Math.random() * 6000, nextBored = last + 5000;
    function start(name, now) {
      mv = { n: name, t0: now, dir: Math.random() < .5 ? 1 : -1 };
      if (name === 'hat') {
        var pool = HAT_NAMES.filter(function (n) { return n !== lastHat; });
        lastHat = pool[Math.floor(Math.random() * pool.length)];
        hatEl.innerHTML = HATS[lastHat];
      }
    }

    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!reduce) T += dt;

      /* schedule: a spin every 10-18s, and when nobody has touched it for 6s it gets bored */
      if (!reduce && !mv && hov < .2 && press === 0) {
        if (now > nextSpin) { start('spin', now); nextSpin = now + 10000 + Math.random() * 8000; }
        else if (now - lastMove > 4000 && now > nextBored) {
          var pool = BORED.filter(function (n) { return n !== lastBored; });
          lastBored = pool[Math.floor(Math.random() * pool.length)];
          start(lastBored, now);
          nextBored = now + 3500 + Math.random() * 3500;
        }
      }
      var o = { spin: 0, jx: 0, jy: 0, sx: 1, sy: 1, rot: 0, happy: 0, blink: 1, gx: null, gy: null, gyo: 0, hat: null };
      if (mv) {
        var ph = (now - mv.t0) / MOVES[mv.n].d;
        if (ph >= 1) mv = null; else MOVES[mv.n].f(ph, o, mv);
      }

      var tx = 0, ty = 0;
      if (px !== null && now - lastMove < 5000) {
        var r = cv.getBoundingClientRect();
        var dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
        var dist = Math.hypot(dx, dy) || 1, m = Math.min(1, dist / 240);
        tx = dx / dist * m; ty = -dy / dist * m;
      } else if (!reduce) { /* idle: look around lazily */
        tx = sin(T * .5) * .55; ty = sin(T * .37 + 1) * .3;
      }
      if (o.gx !== null) { tx = o.gx; ty = o.gy; }
      ty += o.gyo;
      var k = 1 - Math.exp(-dt * 9);
      gx += (tx - gx) * k; gy += (ty - gy) * k;
      hov += (hovT - hov) * (1 - Math.exp(-dt * 10));
      press = Math.max(0, press - dt * 2.2);
      var happy = Math.min(1, hov * .75 + press + o.happy);
      var blink = 1;
      if (!reduce) {
        if (blinkStart < 0 && now > blinkAt) blinkStart = now;
        if (blinkStart >= 0) {
          var bp = (now - blinkStart) / 170;
          if (bp >= 1) { blinkStart = -1; blinkAt = now + 1800 + Math.random() * 3200; }
          else blink = 1 - sin(PI * bp);
        }
      }
      blink = Math.min(blink, o.blink);
      if (o.hat) {
        var hk = body.clientWidth / 128;
        hatOn = true;
        hatEl.style.opacity = o.hat.a.toFixed(3);
        hatEl.style.transform = 'translate(' + (o.hat.x * hk).toFixed(2) + 'px,' + (o.hat.y * hk).toFixed(2) + 'px) rotate(' + o.hat.r.toFixed(2) + 'deg)';
      } else if (hatOn) { hatOn = false; hatEl.style.opacity = '0'; }
      var hs = 1 + .08 * hov;
      body.style.translate = o.jx.toFixed(2) + 'px ' + o.jy.toFixed(2) + 'px';
      body.style.scale = (o.sx * hs).toFixed(3) + ' ' + (o.sy * hs).toFixed(3);
      body.style.rotate = o.rot.toFixed(2) + 'deg';
      dk += ((isDark() ? 1 : 0) - dk) * (1 - Math.exp(-dt * 3.5));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uDark, dk);
      gl.uniform2f(U.uRes, cv.width, cv.height);
      gl.uniform1f(U.uTime, T);
      gl.uniform2f(U.uGaze, gx, gy);
      gl.uniform1f(U.uBlink, blink);
      gl.uniform1f(U.uHappy, happy);
      gl.uniform1f(U.uSpin, o.spin);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- Scroll edge effect + back to top ---------- */
  var barEl = $('bar'), backTop = $('backTop');
  function onScroll() {
    var y = window.scrollY || 0;
    barEl.classList.toggle('scrolled', y > 24);
    backTop.classList.toggle('show', y > 320);
  }
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  addEventListener('hashchange', function () { show(location.hash.slice(1)); applyLanguage(document); });
  applyLanguage(document);
  show(location.hash.slice(1) || 'home');
  applyLanguage(document);
})();
