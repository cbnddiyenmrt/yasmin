document.addEventListener('DOMContentLoaded', () => {

/* ════════════════════════════════════════════════════════
   PHASE 1 — Rock Paper Scissors (Original Logic)
════════════════════════════════════════════════════════ */

    const choices = {
        'tas':   { icon: 'fa-hand-fist',     losesTo: 'kagit' },
        'kagit': { icon: 'fa-hand',           losesTo: 'makas' },
        'makas': { icon: 'fa-hand-scissors',  losesTo: 'tas'   }
    };
    const choiceIcons = ['fa-hand-fist', 'fa-hand', 'fa-hand-scissors'];
    const roundMessages = [
        "Acemi şansı..",
        "Geri dönüşleri severiz.",
        "Oyun hala bitmedi 🤠",
        "Ardarda 4 defa kaybedeceğimi düşünmüyorum, umarım şu an bu yazdıklarımı yanyana okumuyor oluruz.",
        "Eğer bu yazıyı okuyorsan hilesin",
        "🤡🤡🤡🤡🤡🤡"
    ];

    const baseCircleSize = 140;
    const growPerWin     = 15;
    let score = 0;
    const maxScore = 6;
    let isAnimating = false;
    let cycleInterval = null;

    const btns               = document.querySelectorAll('.choice-btn');
    const playerChoiceDisplay = document.getElementById('player-choice');
    const systemChoiceDisplay = document.getElementById('system-choice');
    const playerWinsEl       = document.getElementById('player-wins');
    const playerAvatarNode   = document.querySelector('.player-side .avatar-ring');
    const resultMessage      = document.getElementById('round-result');
    const scoreEl            = document.getElementById('score');
    const scoreMaxEl         = document.getElementById('score-max');
    const loadingBarWrapper  = document.getElementById('loading-bar');
    const loadingFill        = loadingBarWrapper.querySelector('.loading-bar-fill');
    const gameSection        = document.getElementById('game-section');
    const transitionSec      = document.getElementById('transition-section');

    btns.forEach(btn => btn.addEventListener('click', () => {
        if (score >= maxScore || isAnimating) return;
        playRound(btn.dataset.choice);
    }));

    function setButtonsDisabled(d) { btns.forEach(b => b.disabled = d); }

    function startCycling() {
        let idx = 0;
        systemChoiceDisplay.classList.add('cycling');
        cycleInterval = setInterval(() => {
            idx = (idx + 1) % choiceIcons.length;
            systemChoiceDisplay.innerHTML = `<i class="fa-solid ${choiceIcons[idx]}"></i>`;
        }, 280);
    }

    function stopCycling() {
        if (cycleInterval) { clearInterval(cycleInterval); cycleInterval = null; }
        systemChoiceDisplay.classList.remove('cycling');
    }

    function playRound(playerChoice) {
        isAnimating = true;
        setButtonsDisabled(true);

        playerChoiceDisplay.classList.remove('pop');
        void playerChoiceDisplay.offsetWidth;
        playerChoiceDisplay.innerHTML = `<i class="fa-solid ${choices[playerChoice].icon}"></i>`;
        playerChoiceDisplay.classList.add('pop');

        resultMessage.innerText = '';
        loadingBarWrapper.classList.remove('hidden');
        loadingFill.classList.remove('animate');
        void loadingFill.offsetWidth;
        loadingFill.classList.add('animate');
        startCycling();

        setTimeout(() => {
            stopCycling();
            loadingBarWrapper.classList.add('hidden');

            let systemChoice = '';
            for (const [key, value] of Object.entries(choices)) {
                if (value.losesTo === playerChoice) { systemChoice = key; break; }
            }

            systemChoiceDisplay.classList.remove('pop');
            void systemChoiceDisplay.offsetWidth;
            systemChoiceDisplay.innerHTML = `<i class="fa-solid ${choices[systemChoice].icon}"></i>`;
            systemChoiceDisplay.classList.add('pop');

            score++;
            scoreEl.innerText = score;

            const systemAvatar = document.querySelector('.system-side .avatar-img');
            systemAvatar.src = score === 6 ? 'assets/boy_4.png' : 'assets/boy_3.png';

            if (score === 3) scoreMaxEl.innerText = '♾️';

            const newSize = baseCircleSize + (score * growPerWin);
            playerAvatarNode.style.width  = newSize + 'px';
            playerAvatarNode.style.height = newSize + 'px';
            playerAvatarNode.style.boxShadow = `0 0 ${35 + score * 10}px var(--accent-glow)`;
            playerWinsEl.innerText   = score;
            playerWinsEl.style.fontSize = (180 + score * 20) + 'px';

            resultMessage.innerText = roundMessages[score - 1];

            if (score === maxScore) {
                setTimeout(endPhaseOne, 4000);
            } else {
                isAnimating = false;
                setButtonsDisabled(false);
            }
        }, 3000);
    }

    function endPhaseOne() {
        gameSection.classList.remove('active');
        setTimeout(() => {
            gameSection.classList.add('hidden');
            transitionSec.classList.remove('hidden');
            setTimeout(() => {
                transitionSec.classList.add('active');
                // After 5 seconds → go to Phase 2 Map
                setTimeout(() => goTo('map-section'), 5000);
            }, 50);
        }, 1000);
    }


/* ════════════════════════════════════════════════════════
   PHASE 2 — Question Data
════════════════════════════════════════════════════════ */

    // ─── Activity 1: Zaman Kapsülü Soruları (Q3–Q17) ───
    const A1Q = [
        {
            id: 'q3_harita', type: 'map', num: '3',
            text: 'Haritadan Renosu bul ve işaretle',
            sub: '5km yarıçapı içinde olursan yeterli 😊',
            center: [36.79449973553261, 34.592999527918835],
            radius: 5000
        },
        {
            id: 'q4_cuzdan', type: 'textarea', num: '4',
            text: 'Yolda cüzdan buldun, içinde para var. Ne yaparsın?',
            placeholder: 'Düşüncelerini yaz...'
        },
        {
            id: 'q5_ses', type: 'audio', num: '5',
            text: 'Duyduğun ses hangi parçaya ait?',
            sub: 'Önce dinle, sonra yaz.',
            audioSrc: 'assets/karagozlum.mp3',
            placeholder: 'Parçanın adını yaz...',
            accepted: ['karagözlüm', 'karagozlum', 'kara gözlüm', 'kara gozlum', 'karagozlum']
        },
        {
            id: 'q6_surpriz', type: 'choice', num: '6',
            text: 'Sürpriz mi daha etkili, yoksa planlı şeyler mi?',
            options: [{ id: 'A', text: 'Sürpriz' }, { id: 'B', text: 'Planlı' }]
        },
        {
            id: 'q7_gorsel', type: 'image', num: '7',
            text: 'Bu görüntü nerede çekildi?',
            imgSrc: 'assets/tucco.jpg',
            placeholder: 'Mekan adını yaz...',
            correct: 'Tucco'
        },
        {
            id: 'q8_motivasyon', type: 'choice', num: '8',
            text: 'Sence insanları en çok ne motive eder?',
            options: [
                { id: 'A', text: 'Para' },
                { id: 'B', text: 'Tutku' },
                { id: 'C', text: 'Statü' }
            ]
        },
        {
            id: 'q9_deger', type: 'textarea', num: '9',
            text: 'Sence birinin sana değer verdiğini en çok ne gösterir?',
            placeholder: 'Düşüncelerini paylaş...'
        },
        {
            id: 'q10_gurur', type: 'textarea', num: '10',
            text: 'Aramızdaki hangi zorluğu aştığımız için bizimle gurur duyuyorsun?',
            placeholder: 'O anı anlat...'
        },
        {
            id: 'q11_yanlis', type: 'choice', num: '11',
            text: 'Bunlardan hangisi yanlış?',
            options: [
                { id: 'A', text: 'Kahveyi şekersiz içerim' },
                { id: 'B', text: 'Vergi kaçırıyorum' },
                { id: 'C', text: 'Miyopum' },
                { id: 'D', text: 'Ailenle tanışmak istiyorum' },
                { id: 'E', text: 'Seni seviyorum' }
            ],
            correct: 'D',
            correctMsg: 'Hah, bildin! 😏',
            wrongMsg: 'Yanlış! Doğrusu D — Ailenle tanışmak istiyorum 😊'
        },
        {
            id: 'q12_romantik', type: 'choice', num: '12',
            text: 'Sence hangisi daha romantik?',
            options: [
                { id: 'A', text: 'Hiç beklemediğim bir anda gelen küçük bir hediye' },
                { id: 'B', text: 'Zor bir günümde sadece yanımda olup beni dinlemen' }
            ]
        },
        {
            id: 'q13_biri', type: 'choice', num: '13',
            text: 'Birini seç:',
            options: [
                { id: 'A', text: 'Sessiz bir sahil akşamı' },
                { id: 'B', text: 'Kalabalık bir konser' }
            ]
        },
        {
            id: 'q14_para', type: 'choice', num: '14',
            text: 'Sence para:',
            options: [
                { id: 'A', text: 'Özgürlük sağlar' },
                { id: 'B', text: 'Güven sağlar' }
            ]
        },
        {
            id: 'q15_challenge', type: 'textarea', num: '15',
            text: 'Sence birlikte başarmamız gereken en büyük meydan okuma nedir?',
            placeholder: 'Hayalini yaz...'
        },
        {
            id: 'q16_yaslanince', type: 'textarea', num: '16',
            text: 'Yüzümüz kırıştığında ve saçlarımız beyazladığında, benimle ilgili nelerin asla değişmemesini istersin?',
            placeholder: 'Kalbinden yaz...'
        },
        {
            id: 'q17_fotograf', type: 'photo', num: '17',
            text: 'Galerinize gir ve birlikte çekildiğimiz en sevdiğin fotoğrafı seç.',
            bonusQ: 'Sence o seçtiğin fotoğraftaki anı bu kadar özel kılan neydi?',
            bonusPlaceholder: 'O anı anlat...'
        }
    ];

    // ─── Activity 2: Kim Daha Çok? ───
    const A2Q = [
        'Kim daha çok düşünür?',
        'Kim daha çok erteler?',
        'Kim daha çabuk sıkılır?',
        'Kim daha inatçı?',
        'Kim daha çok azgın..?',
        'Kim daha çok içine atar?',
        'Kim daha kolay bağlanır?',
        'Kim daha çok risk alır?',
        'Kim daha çok stresli?',
        'Kim daha çok gurur yapar?',
        'Kim daha çok para biriktirir?',
        'Kim daha rahat harcar?',
        'Kim daha çok kıskanır?',
        'Kim daha çok sürpriz yapar?',
        'Kim daha çok uğraştırır?'
    ];

    // ─── Activity 3: Kapsüle Kayıt ───
    const A3Q = [
        {
            id: 'a3_ask', type: 'inline_ask',
            text: 'Aklına gelen ilk kelimeyi yaz:',
            inlinePrefix: 'Aşk =',
            placeholder: '?'
        },
        {
            id: 'a3_zaman', type: 'inline_sentence',
            inlineSentence: 'Seninle konuşurken zaman',
            placeholder: '...'
        },
        {
            id: 'a3_gozler', type: 'eyes_closed',
            text: '10 saniye gözlerini kapat ve aklına gelen ilk şeyi yaz.',
            placeholder: 'Aklına ne geldi?'
        },
        {
            id: 'a3_fark', type: 'textarea',
            text: 'Şimdiye kadar benimle ilgili fark ettiğin bir şey?',
            placeholder: 'Gözlemini paylaş...'
        },
        {
            id: 'a3_ses', type: 'audio_record',
            text: 'Zaman kapsülüne bir ses kaydı ekle.',
            sub: 'Bu ses kaydı ileride yalnızca ikimiz tarafından dinlenecek 🔒'
        },
        {
            id: 'a3_hayal', type: 'textarea',
            text: 'Birlikte kurduğumuz hayallerin içinde seni en çok heyecanlandıran hangisi?',
            placeholder: 'Hayalini anlat...'
        },
        {
            id: 'a3_3kelime', type: 'three_words',
            text: 'Sence beni 3 kelimeyle tanımlasan ne derdin?'
        },
        {
            id: 'a3_superguc', type: 'textarea',
            text: 'Senin gözünde bizim ilişkimizin "süper gücü" nedir?',
            placeholder: 'Süper gücünüz nedir?'
        },
        {
            id: 'a3_ilk_bulus', type: 'textarea',
            text: 'İlk buluşmamızda benim hakkımda ilk düşündüğün şey neydi?',
            placeholder: 'İlk izlenimini anlat...'
        },
        {
            id: 'a3_emin', type: 'textarea',
            text: 'Beni sevdiğinden emin olduğun ilk anı hatırlıyor musun?',
            placeholder: 'O anı anlat...'
        },
        {
            id: 'a3_unutulmaz', type: 'textarea',
            text: 'Birlikte yaptığımız en unutulmaz an hangisiydi?',
            placeholder: 'O anı yaz...'
        },
        {
            id: 'a3_mutlu', type: 'textarea',
            text: 'İlişkimizde seni en çok mutlu eden şey ne?',
            placeholder: 'Mutluluğunu paylaş...'
        },
        {
            id: 'a3_gelistiren', type: 'textarea',
            text: 'İlişkimizi en çok geliştiren şey ne?',
            placeholder: 'Düşünceni yaz...'
        },
        {
            id: 'a3_daha_fazla', type: 'textarea',
            text: 'İlişkimizde daha çok yapmak istediğin bir şey var mı?',
            placeholder: 'Arzunu yaz...'
        },
        {
            id: 'a3_10yil', type: 'textarea',
            text: '10 yıl sonra ilişkimizi nasıl hayal ediyorsun?',
            placeholder: 'Hayal et ve yaz...'
        }
    ];


/* ════════════════════════════════════════════════════════
   PHASE 2 — State
════════════════════════════════════════════════════════ */

    let cap       = {};       // All capsule answers
    let unlocked  = 1;        // 1..4
    let a1idx     = -1;       // -1 = intro
    let a2idx     = 0;
    let a3idx     = 0;
    let a2answers = [];
    let lmap      = null;     // Leaflet map instance
    let lmarker   = null;     // Leaflet marker
    let lcoords   = null;     // Selected [lat, lng]
    let vidState  = null;     // { stream, recorder, chunks }


/* ════════════════════════════════════════════════════════
   SAVE / LOAD / DOWNLOAD
════════════════════════════════════════════════════════ */

    function loadCapsule() {
        try {
            const d = JSON.parse(localStorage.getItem('yas_kap_v1') || '{}');
            cap       = d.cap       || {};
            unlocked  = d.unlocked  || 1;
            a1idx     = d.a1idx !== undefined ? d.a1idx : -1;
            a2idx     = d.a2idx     || 0;
            a3idx     = d.a3idx     || 0;
            a2answers = d.a2answers || [];
        } catch (e) { /* ignore */ }
    }

    function saveCapsule() {
        try {
            localStorage.setItem('yas_kap_v1', JSON.stringify({
                cap, unlocked, a1idx, a2idx, a3idx, a2answers
            }));
        } catch (e) { /* ignore */ }
    }

    function saveAnswer(key, val) {
        cap[key] = { val, ts: new Date().toISOString() };
        saveCapsule();
    }

    function downloadCapsule() {
        const export_data = {
            metadata: {
                exported: new Date().toISOString(),
                version: 1,
                stages_completed: unlocked - 1
            },
            answers: cap,
            activity2_results: a2answers
        };
        const json = JSON.stringify(export_data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'zaman_kapsulu.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


/* ════════════════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════════════════ */

    const ALL_SECTIONS = [
        'game-section', 'transition-section',
        'map-section', 'act1-sec', 'act2-sec', 'act3-sec', 'chest-sec'
    ];

    function goTo(id) {
        ALL_SECTIONS.forEach(sid => {
            const el = document.getElementById(sid);
            if (!el) return;
            el.classList.remove('active');
            el.classList.add('hidden');
        });
        const target = document.getElementById(id);
        if (!target) return;
        target.classList.remove('hidden');
        requestAnimationFrame(() => requestAnimationFrame(() => target.classList.add('active')));
    }


/* ════════════════════════════════════════════════════════
   MAP SECTION
════════════════════════════════════════════════════════ */

    function updateMapNodes() {
        for (let i = 1; i <= 4; i++) {
            const nd = document.getElementById('pnd-' + i);
            if (!nd) continue;
            nd.classList.remove('nd-locked', 'nd-unlocked', 'nd-done');
            if (i < unlocked)      nd.classList.add('nd-done');
            else if (i === unlocked) nd.classList.add('nd-unlocked');
            else                    nd.classList.add('nd-locked');
        }
    }

    document.querySelectorAll('.path-nd').forEach(nd => {
        nd.addEventListener('click', () => {
            const s = parseInt(nd.dataset.stage);
            if (s > unlocked) return;
            if (s === 1) startA1();
            else if (s === 2) startA2();
            else if (s === 3) startA3();
            else if (s === 4) startChest();
        });
    });


/* ════════════════════════════════════════════════════════
   ACTIVITY 1 — Zaman Kapsülü Soruları
════════════════════════════════════════════════════════ */

    function startA1() {
        if (lmap) { lmap.remove(); lmap = null; }
        goTo('act1-sec');
        if (a1idx >= A1Q.length) {
            // Already completed — show done state
            document.getElementById('a1-pr').style.width = '100%';
            document.getElementById('a1-body').innerHTML = `
                <div class="q-card intro-card">
                    <div class="intro-ico">✅</div>
                    <h2 class="intro-title">Tamamlandı!</h2>
                    <p class="intro-desc">Bu bölümün tüm sorularını cevapladın. Haritaya dönebilirsin.</p>
                    <button class="prim-btn" id="a1-done-back">← Haritaya Dön</button>
                </div>`;
            document.getElementById('a1-done-back').addEventListener('click', () => goTo('map-section'));
            return;
        }
        renderA1(a1idx);
    }

    function renderA1(idx) {
        a1idx = idx;
        hideA1Fb();
        if (lmap) { lmap.remove(); lmap = null; lmarker = null; lcoords = null; }

        const body = document.getElementById('a1-body');
        const pr   = document.getElementById('a1-pr');

        if (idx === -1) {
            pr.style.width = '0%';
            body.innerHTML = `
                <div class="q-card intro-card">
                    <div class="intro-ico">⏳</div>
                    <h2 class="intro-title">Zaman Kapsülü</h2>
                    <p class="intro-desc">Az sonraki sorular ve cevapları zaman kapsülünün içerisine kayıt edilecek ve ileride açılmak üzere korunacak/saklanacaktır.</p>
                    <button class="prim-btn" id="a1-start-btn">Başla →</button>
                </div>`;
            document.getElementById('a1-start-btn').addEventListener('click', () => renderA1(0));
            return;
        }

        pr.style.width = ((idx + 1) / A1Q.length * 100) + '%';
        const q = A1Q[idx];

        switch (q.type) {
            case 'map':      renderA1Map(q, body); break;
            case 'textarea': renderA1Textarea(q, body); break;
            case 'audio':    renderA1Audio(q, body); break;
            case 'choice':   renderA1Choice(q, body); break;
            case 'image':    renderA1Image(q, body); break;
            case 'photo':    renderA1Photo(q, body); break;
        }
    }

    function qHdr(q) {
        return `<div class="q-num">SORU ${q.num}</div>
                <h3 class="q-txt">${q.text}</h3>
                ${q.sub ? `<p class="q-sub">${q.sub}</p>` : ''}`;
    }

    // ── Map Question (Q3) ──
    function renderA1Map(q, body) {
        body.innerHTML = `
            <div class="q-card">
                ${qHdr(q)}
                <div id="q3-map" class="lf-map"></div>
                <p class="map-hint" id="map-hint">Haritaya dokunarak bir konum seç 📍</p>
                <button class="check-btn" id="map-check" disabled>Kontrol Et</button>
            </div>`;

        setTimeout(() => {
            lmap = L.map('q3-map', { zoomControl: true }).setView(q.center, 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(lmap);
            L.circle(q.center, {
                radius: q.radius,
                color: '#f74b7c', weight: 2,
                fillColor: '#f74b7c', fillOpacity: 0.07,
                dashArray: '8 4'
            }).addTo(lmap);
            lmap.invalidateSize();

            const icon = L.divIcon({
                html: '<div class="lf-marker"></div>',
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            lmap.on('click', e => {
                lcoords = [e.latlng.lat, e.latlng.lng];
                if (lmarker) lmap.removeLayer(lmarker);
                lmarker = L.marker(lcoords, { icon }).addTo(lmap);
                document.getElementById('map-check').disabled = false;
                document.getElementById('map-hint').textContent = '"Kontrol Et" butonuna bas 🗺️';
            });

            document.getElementById('map-check').addEventListener('click', () => {
                if (!lcoords) return;
                const dist = haversineKm(lcoords[0], lcoords[1], q.center[0], q.center[1]);
                saveAnswer(q.id, { coords: lcoords, distKm: +dist.toFixed(2) });
                if (dist <= 5) {
                    showA1Fb('correct', '🗺️', `Buldun! ${dist.toFixed(1)}km uzakta.`);
                } else {
                    showA1Fb('wrong', '🤔', `${dist.toFixed(1)}km uzaktasın. Ama yine de kaydedildi!`);
                }
            });
        }, 250);
    }

    function haversineKm(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2
                + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ── Textarea Question ──
    function renderA1Textarea(q, body) {
        body.innerHTML = `
            <div class="q-card">
                ${qHdr(q)}
                <textarea id="q-ta" class="q-ta" placeholder="${q.placeholder || 'Düşüncelerini yaz...'}"></textarea>
                <button class="check-btn" id="ta-check" disabled>Devam →</button>
            </div>`;
        const ta  = document.getElementById('q-ta');
        const btn = document.getElementById('ta-check');
        ta.addEventListener('input', () => { btn.disabled = ta.value.trim().length < 2; });
        btn.addEventListener('click', () => {
            saveAnswer(q.id, ta.value.trim());
            showA1Fb('neutral', '💾', 'Kapsüle kaydedildi ✨');
        });
    }

    // ── Audio Question (Q5) ──
    function renderA1Audio(q, body) {
        const waveSpans = Array(10).fill('<span></span>').join('');
        body.innerHTML = `
            <div class="q-card">
                ${qHdr(q)}
                <div class="audio-player">
                    <button class="aud-play-btn" id="aud-play">
                        <i class="fa-solid fa-play"></i>
                    </button>
                    <div class="aud-wave" id="aud-wave">${waveSpans}</div>
                    <audio id="aud-el" src="${q.audioSrc}"></audio>
                </div>
                <input type="text" id="q-aud-inp" class="q-inp" placeholder="${q.placeholder || '...'}">
                <button class="check-btn" id="aud-check" disabled>Kontrol Et</button>
            </div>`;

        const audEl   = document.getElementById('aud-el');
        const playBtn = document.getElementById('aud-play');
        const wave    = document.getElementById('aud-wave');
        const inp     = document.getElementById('q-aud-inp');
        const chk     = document.getElementById('aud-check');

        playBtn.addEventListener('click', () => {
            if (audEl.paused) {
                audEl.play();
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                wave.classList.add('playing');
            } else {
                audEl.pause();
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                wave.classList.remove('playing');
            }
        });
        audEl.addEventListener('ended', () => {
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            wave.classList.remove('playing');
        });
        inp.addEventListener('input', () => { chk.disabled = inp.value.trim().length === 0; });
        chk.addEventListener('click', () => {
            const val   = inp.value.trim();
            saveAnswer(q.id, val);
            const norm  = s => s.toLowerCase()
                .replace(/[ğ]/g,'g').replace(/[ü]/g,'u').replace(/[ş]/g,'s')
                .replace(/[ı]/g,'i').replace(/[ö]/g,'o').replace(/[ç]/g,'c')
                .replace(/\s+/g,'');
            const ok = q.accepted.some(a => norm(val) === norm(a) || norm(val).includes(norm(a)));
            if (ok) showA1Fb('correct', '🎵', 'Doğru! Karagözlüm 💕');
            else    showA1Fb('wrong',   '🎵', 'Değil... Doğrusu: Karagözlüm ❤️');
        });
    }

    // ── Choice Question ──
    function renderA1Choice(q, body) {
        const opts = q.options.map(o => `
            <button class="q-opt" data-id="${o.id}">
                <span class="opt-ltr">${o.id}</span>
                <span>${o.text}</span>
            </button>`).join('');
        body.innerHTML = `
            <div class="q-card">
                ${qHdr(q)}
                <div class="opts-wrap">${opts}</div>
            </div>`;

        document.querySelectorAll('.q-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.q-opt').forEach(b => {
                    b.classList.remove('selected');
                    b.disabled = true;
                });
                btn.classList.add('selected');
                const sel = btn.dataset.id;
                saveAnswer(q.id, sel);

                if (q.correct) {
                    if (sel === q.correct) {
                        btn.classList.add('opt-ok');
                        showA1Fb('correct', '✅', q.correctMsg || 'Doğru! 🎉');
                    } else {
                        btn.classList.add('opt-wrong');
                        const cb = document.querySelector(`.q-opt[data-id="${q.correct}"]`);
                        if (cb) cb.classList.add('opt-ok');
                        showA1Fb('wrong', '❌', q.wrongMsg || `Yanlış. Doğrusu: ${q.correct}`);
                    }
                } else {
                    showA1Fb('neutral', '💾', 'Cevabın kaydedildi ✨');
                }
            });
        });
    }

    // ── Image Question (Q7) ──
    function renderA1Image(q, body) {
        body.innerHTML = `
            <div class="q-card">
                ${qHdr(q)}
                <img src="${q.imgSrc}" class="q-img" alt="Nerede?">
                <input type="text" id="q-img-inp" class="q-inp" placeholder="${q.placeholder || 'Yer adını yaz...'}">
                <button class="check-btn" id="img-check" disabled>Kontrol Et</button>
            </div>`;
        const inp = document.getElementById('q-img-inp');
        const chk = document.getElementById('img-check');
        inp.addEventListener('input', () => { chk.disabled = inp.value.trim().length === 0; });
        chk.addEventListener('click', () => {
            const val  = inp.value.trim();
            saveAnswer(q.id, val);
            const norm = s => s.toLowerCase()
                .replace(/[ğüşıöç]/g, c => ({ğ:'g',ü:'u',ş:'s',ı:'i',ö:'o',ç:'c'})[c] || c);
            if (norm(val).includes(norm(q.correct))) {
                showA1Fb('correct', '📍', `Evet! Orası ${q.correct}! 🌟`);
            } else {
                showA1Fb('wrong', '📍', `Doğrusu: ${q.correct} 😊`);
            }
        });
    }

    // ── Photo Upload (Q17) ──
    function renderA1Photo(q, body) {
        body.innerHTML = `
            <div class="q-card">
                ${qHdr(q)}
                <label class="photo-upload-label" for="photo-file-inp" id="photo-lbl">
                    <i class="fa-solid fa-image"></i>
                    <span>Fotoğraf seç</span>
                    <input type="file" id="photo-file-inp" accept="image/*" style="display:none">
                </label>
                <img id="photo-preview" class="uploaded-photo hidden" alt="Seçilen fotoğraf">
                <div id="bonus-wrap" class="bonus-wrap hidden">
                    <p class="bonus-q-txt">${q.bonusQ}</p>
                    <textarea id="bonus-ta" class="q-ta" placeholder="${q.bonusPlaceholder || '...'}"></textarea>
                    <button class="check-btn" id="bonus-check" disabled>Devam →</button>
                </div>
            </div>`;

        const fileInp    = document.getElementById('photo-file-inp');
        const preview    = document.getElementById('photo-preview');
        const bonusWrap  = document.getElementById('bonus-wrap');
        const bonusTa    = document.getElementById('bonus-ta');
        const bonusCheck = document.getElementById('bonus-check');

        fileInp.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                preview.src = ev.target.result;
                preview.classList.remove('hidden');
                document.getElementById('photo-lbl').style.display = 'none';
                bonusWrap.classList.remove('hidden');
                saveAnswer(q.id + '_uploaded', true);
                // Store small thumbnail reference
                try {
                    saveAnswer(q.id + '_filename', file.name);
                } catch (e) {}
            };
            reader.readAsDataURL(file);
        });

        bonusTa.addEventListener('input', () => { bonusCheck.disabled = bonusTa.value.trim().length < 2; });
        bonusCheck.addEventListener('click', () => {
            saveAnswer(q.id + '_bonus', bonusTa.value.trim());
            showA1Fb('neutral', '📸', 'Fotoğraf ve anın kapsüle eklendi 💕');
        });
    }

    // ── Feedback Helpers ──
    function showA1Fb(type, ico, msg) {
        const fb = document.getElementById('a1-fb');
        fb.className = 'slide-fb fb-' + type + ' show';
        document.getElementById('a1-fb-ico').textContent = ico;
        document.getElementById('a1-fb-txt').textContent = msg;
    }
    function hideA1Fb() {
        const fb = document.getElementById('a1-fb');
        fb.classList.remove('show', 'fb-correct', 'fb-wrong', 'fb-neutral');
        fb.className = 'slide-fb';
    }

    document.getElementById('a1-fb-go').addEventListener('click', () => {
        hideA1Fb();
        if (lmap) { lmap.remove(); lmap = null; }
        a1idx++;
        saveCapsule();
        if (a1idx >= A1Q.length) {
            unlocked = Math.max(unlocked, 2);
            saveCapsule();
            updateMapNodes();
            goTo('map-section');
        } else {
            renderA1(a1idx);
        }
    });

    document.getElementById('a1-bk').addEventListener('click', () => {
        if (lmap) { lmap.remove(); lmap = null; }
        goTo('map-section');
    });


/* ════════════════════════════════════════════════════════
   ACTIVITY 2 — Kim Daha Çok?
════════════════════════════════════════════════════════ */

    function startA2() {
        goTo('act2-sec');
        if (a2idx >= A2Q.length) {
            // Already completed — show overlay done state
            const prefixEl = document.getElementById('a2-prefix');
            const mainEl   = document.getElementById('a2-main');
            if (prefixEl) prefixEl.textContent = 'Tamamlandı';
            if (mainEl)   mainEl.textContent   = '✅';

            const dotsEl = document.getElementById('a2-dots');
            if (dotsEl) dotsEl.innerHTML = A2Q.map(() => '<span class="a2-dot done"></span>').join('');
            return;
        }
        renderA2(a2idx);
    }

    function parseA2Q(q) {
        const prefix = 'Kim daha';
        if (q.startsWith(prefix)) return { prefix, main: q.slice(prefix.length).trim() };
        return { prefix: '', main: q };
    }

    function renderA2(idx) {
        const parsed   = parseA2Q(A2Q[idx]);
        const prefixEl = document.getElementById('a2-prefix');
        const mainEl   = document.getElementById('a2-main');
        if (prefixEl) prefixEl.textContent = parsed.prefix;
        if (mainEl)   mainEl.textContent   = parsed.main;

        const dotsEl = document.getElementById('a2-dots');
        if (dotsEl) {
            dotsEl.innerHTML = A2Q.map((_, i) =>
                `<span class="a2-dot ${i < idx ? 'done' : i === idx ? 'curr' : ''}"></span>`
            ).join('');
        }
    }

    function handleA2Choice(choice) {
        const sideId = choice === 'sen' ? 'a2-left' : 'a2-right';
        const side = document.getElementById(sideId);
        if (side) { side.classList.add('flash'); setTimeout(() => side.classList.remove('flash'), 600); }

        a2answers.push({ q: A2Q[a2idx], a: choice });
        saveAnswer('a2_q' + a2idx, choice);
        a2idx++;
        saveCapsule();

        if (a2idx >= A2Q.length) {
            unlocked = Math.max(unlocked, 3);
            saveCapsule();
            updateMapNodes();
            setTimeout(() => goTo('map-section'), 700);
        } else {
            setTimeout(() => renderA2(a2idx), 650);
        }
    }

    const a2Left  = document.getElementById('a2-left');
    const a2Right = document.getElementById('a2-right');
    if (a2Left)  a2Left.addEventListener('click',  () => handleA2Choice('sen'));
    if (a2Right) a2Right.addEventListener('click', () => handleA2Choice('ben'));
    document.getElementById('a2-bk').addEventListener('click', () => goTo('map-section'));


/* ════════════════════════════════════════════════════════
   ACTIVITY 3 — Kapsüle Kayıt
════════════════════════════════════════════════════════ */

    function startA3() {
        goTo('act3-sec');
        if (a3idx >= A3Q.length) {
            document.getElementById('a3-pr').style.width = '100%';
            document.getElementById('a3-body').innerHTML = `
                <div class="q-card intro-card">
                    <div class="intro-ico">✅</div>
                    <h2 class="intro-title">Tamamlandı!</h2>
                    <p class="intro-desc">Bu bölümün tüm sorularını cevapladın. Haritaya dönebilirsin.</p>
                    <button class="prim-btn" id="a3-done-back">← Haritaya Dön</button>
                </div>`;
            document.getElementById('a3-done-back').addEventListener('click', () => goTo('map-section'));
            return;
        }
        renderA3(a3idx);
    }

    function renderA3(idx) {
        a3idx = idx;
        hideA3Fb();
        const body = document.getElementById('a3-body');
        const pr   = document.getElementById('a3-pr');
        pr.style.width = ((idx + 1) / A3Q.length * 100) + '%';
        const q = A3Q[idx];

        if (q.type === 'inline_ask') {
            body.innerHTML = `
                <div class="q-card">
                    <h3 class="q-txt">${q.text}</h3>
                    <div class="inline-fill-row">
                        <span class="inline-fill-pre">${q.inlinePrefix}</span>
                        <input type="text" id="a3-inp" class="inline-fill-inp" placeholder="${q.placeholder}">
                    </div>
                    <button class="check-btn" id="a3-check" disabled>Devam →</button>
                </div>`;
            const inp = document.getElementById('a3-inp');
            const btn = document.getElementById('a3-check');
            inp.addEventListener('input', () => { btn.disabled = inp.value.trim().length === 0; });
            btn.addEventListener('click', () => {
                saveAnswer(q.id, inp.value.trim());
                showA3Fb('neutral', '💾', 'Kapsüle eklendi ✨');
            });

        } else if (q.type === 'inline_sentence') {
            body.innerHTML = `
                <div class="q-card">
                    <div class="sentence-fill">
                        <span class="sentence-prefix">${q.inlineSentence}</span>
                        <input type="text" id="a3-inp" class="sentence-inp" placeholder="${q.placeholder}">
                    </div>
                    <button class="check-btn" id="a3-check" disabled>Devam →</button>
                </div>`;
            const inp = document.getElementById('a3-inp');
            const btn = document.getElementById('a3-check');
            inp.addEventListener('input', () => { btn.disabled = inp.value.trim().length === 0; });
            btn.addEventListener('click', () => {
                saveAnswer(q.id, inp.value.trim());
                showA3Fb('neutral', '💾', 'Kapsüle eklendi ✨');
            });

        } else if (q.type === 'three_words') {
            body.innerHTML = `
                <div class="q-card">
                    <h3 class="q-txt">${q.text}</h3>
                    <div class="three-words-row">
                        <input type="text" class="word-box" id="word1" placeholder="1. kelime">
                        <input type="text" class="word-box" id="word2" placeholder="2. kelime">
                        <input type="text" class="word-box" id="word3" placeholder="3. kelime">
                    </div>
                    <button class="check-btn" id="a3-check" disabled>Devam →</button>
                </div>`;
            const w1  = document.getElementById('word1');
            const w2  = document.getElementById('word2');
            const w3  = document.getElementById('word3');
            const btn = document.getElementById('a3-check');
            const chkWords = () => { btn.disabled = !(w1.value.trim() && w2.value.trim() && w3.value.trim()); };
            [w1, w2, w3].forEach(w => w.addEventListener('input', chkWords));
            btn.addEventListener('click', () => {
                saveAnswer(q.id, [w1.value.trim(), w2.value.trim(), w3.value.trim()]);
                showA3Fb('neutral', '💾', 'Kapsüle eklendi ✨');
            });

        } else if (q.type === 'text') {
            body.innerHTML = `
                <div class="q-card">
                    ${q.prefix ? `<p class="q-prefix">${q.prefix}</p>` : ''}
                    <h3 class="q-txt">${q.text}</h3>
                    <input type="text" id="a3-inp" class="q-inp" placeholder="${q.placeholder}">
                    <button class="check-btn" id="a3-check" disabled>Devam →</button>
                </div>`;
            const inp = document.getElementById('a3-inp');
            const btn = document.getElementById('a3-check');
            inp.addEventListener('input', () => { btn.disabled = inp.value.trim().length === 0; });
            btn.addEventListener('click', () => {
                saveAnswer(q.id, inp.value.trim());
                showA3Fb('neutral', '💾', 'Kapsüle eklendi ✨');
            });

        } else if (q.type === 'textarea') {
            body.innerHTML = `
                <div class="q-card">
                    ${q.prefix ? `<p class="q-prefix">${q.prefix}</p>` : ''}
                    <h3 class="q-txt">${q.text}</h3>
                    <textarea id="a3-ta" class="q-ta" placeholder="${q.placeholder}"></textarea>
                    <button class="check-btn" id="a3-check" disabled>Devam →</button>
                </div>`;
            const ta  = document.getElementById('a3-ta');
            const btn = document.getElementById('a3-check');
            ta.addEventListener('input', () => { btn.disabled = ta.value.trim().length < 2; });
            btn.addEventListener('click', () => {
                saveAnswer(q.id, ta.value.trim());
                showA3Fb('neutral', '💾', 'Kapsüle eklendi ✨');
            });

        } else if (q.type === 'eyes_closed') {
            body.innerHTML = `
                <div class="q-card">
                    <h3 class="q-txt">${q.text}</h3>
                    <p class="q-sub">Düşündükten sonra buraya yaz.</p>
                    <button class="prim-btn" id="eyes-start-btn" style="margin-top:1rem;align-self:center">😌 Gözlerimi Kapatıyorum</button>
                    <div id="eyes-result-area" class="hidden bonus-wrap">
                        <p class="bonus-q-txt">Aklına ne geldi?</p>
                        <textarea id="eyes-ta" class="q-ta" placeholder="${q.placeholder}"></textarea>
                        <button class="check-btn" id="eyes-check" disabled>Devam →</button>
                    </div>
                </div>`;

            document.getElementById('eyes-start-btn').addEventListener('click', () => {
                startEyesClosed(() => {
                    document.getElementById('eyes-result-area').classList.remove('hidden');
                    document.getElementById('eyes-start-btn').style.display = 'none';
                    const ta  = document.getElementById('eyes-ta');
                    const btn = document.getElementById('eyes-check');
                    ta.addEventListener('input', () => { btn.disabled = ta.value.trim().length === 0; });
                    btn.addEventListener('click', () => {
                        saveAnswer(q.id, ta.value.trim());
                        showA3Fb('neutral', '💭', 'Kapsüle eklendi ✨');
                    });
                });
            });

        } else if (q.type === 'audio_record') {
            body.innerHTML = `
                <div class="q-card">
                    <h3 class="q-txt">${q.text}</h3>
                    ${q.sub ? `<p class="q-sub">${q.sub}</p>` : ''}
                    <div class="rec-ui">
                        <div class="rec-timer" id="rec-timer">0:00</div>
                        <button class="rec-mic-btn" id="rec-mic-btn">🎤</button>
                        <p class="rec-status" id="rec-status">Kayda başlamak için dokun</p>
                    </div>
                    <audio id="rec-preview" class="rec-audio-prev hidden" controls></audio>
                    <button class="check-btn hidden" id="rec-done-btn">Devam →</button>
                </div>`;

            let recorder = null;
            let chunks   = [];
            let timerIv  = null;
            let secs     = 0;

            const micBtn  = document.getElementById('rec-mic-btn');
            const status  = document.getElementById('rec-status');
            const timer   = document.getElementById('rec-timer');
            const preview = document.getElementById('rec-preview');
            const doneBtn = document.getElementById('rec-done-btn');

            micBtn.addEventListener('click', async () => {
                if (!recorder) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        chunks   = [];
                        recorder = new MediaRecorder(stream);
                        recorder.ondataavailable = e => chunks.push(e.data);
                        recorder.onstop = () => {
                            stream.getTracks().forEach(t => t.stop());
                            const blob = new Blob(chunks, { type: 'audio/webm' });
                            const url  = URL.createObjectURL(blob);
                            preview.src = url;
                            preview.classList.remove('hidden');
                            doneBtn.classList.remove('hidden');
                            doneBtn.disabled = false;
                            saveAnswer(q.id, { recorded: true, durationSecs: secs });

                            // Offer download
                            const dl = document.createElement('a');
                            dl.href     = url;
                            dl.download = 'ses_kaydi.webm';
                            dl.textContent = '⬇️ Ses kaydını indir';
                            dl.className = 'dl-link';
                            preview.insertAdjacentElement('afterend', dl);
                        };
                        recorder.start();
                        micBtn.textContent = '⏹';
                        micBtn.classList.add('recording');
                        status.textContent = 'Kayıt yapılıyor...';
                        secs   = 0;
                        timerIv = setInterval(() => {
                            secs++;
                            timer.textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
                            if (secs >= 120) stopRecording();
                        }, 1000);
                    } catch (err) {
                        status.textContent = '⚠️ Mikrofon izni gerekli!';
                    }
                } else {
                    stopRecording();
                }
            });

            function stopRecording() {
                if (recorder) { recorder.stop(); recorder = null; }
                clearInterval(timerIv);
                micBtn.textContent = '🎤';
                micBtn.classList.remove('recording');
                micBtn.disabled = true;
                status.textContent = 'Kaydedildi!';
            }

            doneBtn.addEventListener('click', () => {
                showA3Fb('neutral', '🎤', 'Ses kaydın kapsüle eklendi ✨');
            });
        }
    }

    function startEyesClosed(cb) {
        const overlay = document.getElementById('eyes-overlay');
        const numEl   = document.getElementById('eyes-num');
        overlay.classList.remove('hidden');
        let n = 10;
        numEl.textContent = n;
        const iv = setInterval(() => {
            n--;
            numEl.textContent = n;
            if (n <= 0) {
                clearInterval(iv);
                overlay.classList.add('hidden');
                cb();
            }
        }, 1000);
    }

    function showA3Fb(type, ico, msg) {
        const fb = document.getElementById('a3-fb');
        fb.className = 'slide-fb fb-' + type + ' show';
        document.getElementById('a3-fb-ico').textContent = ico;
        document.getElementById('a3-fb-txt').textContent = msg;
    }

    function hideA3Fb() {
        const fb = document.getElementById('a3-fb');
        fb.className = 'slide-fb';
    }

    document.getElementById('a3-fb-go').addEventListener('click', () => {
        hideA3Fb();
        a3idx++;
        saveCapsule();
        if (a3idx >= A3Q.length) {
            unlocked = Math.max(unlocked, 4);
            saveCapsule();
            updateMapNodes();
            goTo('map-section');
        } else {
            renderA3(a3idx);
        }
    });

    document.getElementById('a3-bk').addEventListener('click', () => goTo('map-section'));


/* ════════════════════════════════════════════════════════
   CHEST SECTION
════════════════════════════════════════════════════════ */

    function startChest() {
        goTo('chest-sec');
    }

    document.getElementById('open-chest-btn').addEventListener('click', () => {
        document.getElementById('chest-closed').classList.add('hidden');
        document.getElementById('chest-open').classList.remove('hidden');
    });

    // Helper: trigger file download
    function triggerDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    // Camera → open + immediately start recording
    document.getElementById('cam-btn').addEventListener('click', async () => {
        const choiceArea = document.getElementById('vid-choice-area');
        const recWrap    = document.getElementById('vid-rec-wrap');
        if (choiceArea) choiceArea.classList.add('hidden');
        recWrap.classList.remove('hidden');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
            document.getElementById('vid-live').srcObject = stream;
            vidState = { stream, chunks: [], recorder: null, timerIv: null };
            startImmedRec(stream);
        } catch (err) {
            recWrap.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:1.5rem">⚠️ Kamera izni gerekiyor.<br><small>Tarayıcı ayarlarından izin ver.</small></p>';
        }
    });

    function startImmedRec(stream) {
        vidState.chunks = [];
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9'
                       : MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : '';
        const opts = mimeType ? { mimeType } : {};
        const recorder = new MediaRecorder(stream, opts);
        vidState.recorder = recorder;

        recorder.ondataavailable = e => { if (e.data && e.data.size > 0) vidState.chunks.push(e.data); };
        recorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            clearInterval(vidState.timerIv);

            const ext  = mimeType && mimeType.includes('webm') ? 'webm' : 'mp4';
            const blob = new Blob(vidState.chunks, { type: mimeType || 'video/mp4' });
            const url  = URL.createObjectURL(blob);

            document.getElementById('vid-rec-wrap').classList.add('hidden');
            document.getElementById('vid-saved').src = url;
            const doneWrap = document.getElementById('vid-done-wrap');
            doneWrap.classList.remove('hidden');

            // Auto-download video
            triggerDownload(url, 'kapsul_video.' + ext);
            // Auto-download JSON capsule after brief delay
            setTimeout(downloadCapsule, 1800);

            document.getElementById('dl-vid-btn-manual').onclick = () => triggerDownload(url, 'kapsul_video.' + ext);
        };

        recorder.start();

        // Live timer
        let secs = 0;
        vidState.timerIv = setInterval(() => {
            secs++;
            const timerEl = document.getElementById('rec-timer-live');
            if (timerEl) timerEl.textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
        }, 1000);
    }

    document.getElementById('stop-rec').addEventListener('click', () => {
        if (vidState && vidState.recorder && vidState.recorder.state !== 'inactive') {
            vidState.recorder.stop();
        }
    });

    // Video file upload: show preview + auto-save
    document.getElementById('vid-file-inp').addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const choiceArea = document.getElementById('vid-choice-area');
        if (choiceArea) choiceArea.classList.add('hidden');

        const url = URL.createObjectURL(file);
        document.getElementById('vid-saved').src = url;
        const msgEl = document.getElementById('vid-done-msg');
        if (msgEl) msgEl.textContent = 'Video yüklendi! Kapsül indiriliyor...';
        document.getElementById('vid-done-wrap').classList.remove('hidden');

        setTimeout(downloadCapsule, 1000);
        document.getElementById('dl-vid-btn-manual').onclick = () => {
            const a = document.createElement('a');
            a.href = url; a.download = file.name;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        };
    });

    document.getElementById('dl-all-btn').addEventListener('click', downloadCapsule);


/* ════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════ */

    loadCapsule();
    updateMapNodes();

}); // DOMContentLoaded
