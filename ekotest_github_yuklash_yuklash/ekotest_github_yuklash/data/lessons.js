// Darsliklar: har bir mavzu uchun bitta dars. Mavzu id'lari data/questions.js dagi bilan bir xil.
// Format: { sarlavha, kirish, bolimlar: [{ h, p: [abzaslar] }], eslab: [qisqa xulosalar] }
module.exports = {
  asos: {
    sarlavha: "Ekologiya nima va u nimani o'rganadi?",
    kirish: "Ekologiya — tirik organizmlarning bir-biri bilan va atrof-muhit bilan aloqasini o'rganadigan fan. Bu so'zni fanga 1866-yilda nemis olimi Ernst Gekkel kiritgan.",
    bolimlar: [
      { h: "Ekotizim", p: ["Ekotizim — tirik organizmlar va ularning yashash muhitining birligi. O'rmon, ko'l, cho'l, hatto kichik hovuz ham ekotizim bo'la oladi.", "Ekotizimda o'simliklar (produsentlar) quyosh nuri, suv va karbonat angidriddan organik modda hosil qiladi. Hayvonlar (konsumentlar) tayyor organik moddalar bilan oziqlanadi. Bakteriya va zamburug'lar (redutsentlar) o'lgan qoldiqlarni chiritib, tuproqqa qaytaradi."] },
      { h: "Oziq zanjiri", p: ["Oziq zanjiri — moddalar va energiya bir organizmdan boshqasiga o'tishini ko'rsatadi. Masalan: o't → quyon → tulki. Zanjirning bir bo'g'ini yo'qolsa, qolganlariga ham ta'sir qiladi.", "Shu sababli tabiatdagi har bir tur muhim: birortasining yo'qolishi butun ekotizim muvozanatini buzishi mumkin."] },
      { h: "Biosfera va populyatsiya", p: ["Biosfera — Yerning tirik organizmlar yashaydigan qobig'i. U suv, tuproq va atmosferaning pastki qismini o'z ichiga oladi.", "Populyatsiya — bir turga mansub organizmlarning ma'lum hududdagi to'plami. Masalan, ma'lum ko'ldagi baliqlar."] },
      { h: "Inson va tabiat", p: ["Inson ham biosferaning bir qismi. Aholi soni ortgani sari suv, yer, energiya kabi resurslarga ehtiyoj va tabiatga bosim ortadi. Shuning uchun resurslardan oqilona foydalanish zarur."] }
    ],
    eslab: ["Ekologiya organizmlar va muhit aloqasini o'rganadi.", "Ekotizim: produsent, konsument, redutsent.", "Oziq zanjiri: o't → quyon → tulki.", "Biosfera — hayot tarqalgan qobiq."]
  },

  suv: {
    sarlavha: "Suv resurslari va ularni tejash",
    kirish: "Suv — hayot manbai. Lekin Yerdagi suvning juda oz qismi chuchuk va undan ham kam qismi osongina foydalanishga yaroqli.",
    bolimlar: [
      { h: "Suv tabiatda", p: ["Yer yuzidagi suvning ko'p qismi sho'r okeanlarda. Chuchuk suv taxminan 3% ni tashkil qiladi, uning katta qismi muzliklar va doimiy qorlarda to'plangan.", "Suv tabiatda aylanib turadi: Quyosh issiqligi ta'sirida bug'lanadi, bulutga aylanadi, yog'in bo'lib yerga qaytadi."] },
      { h: "O'zbekiston daryolari", p: ["Markaziy Osiyoning ikki katta daryosi — Amudaryo (Pomirdan boshlanadi) va Sirdaryo (Norin va Qoradaryo qo'shilishidan hosil bo'ladi). Zarafshon Samarqand va Buxoro yonidan, Chirchiq Toshkentdan oqib o'tadi.", "Amudaryo va Sirdaryo Orol dengiziga quyilgan. Paxta va sholi dalalarini sug'orish uchun ko'p suv olingani sababli Orol dengizi qurib, o'rnida Orolqum cho'li paydo bo'ldi. Qurigan tubdan ko'tarilgan tuzli chang aholi salomatligi va qishloq xo'jaligiga zarar yetkazmoqda."] },
      { h: "Suv nimadan ifloslanadi?", p: ["Suvni tozalanmagan oqova suvlar, sanoat chiqindilari, mineral o'g'it va pestitsidlarning ortiqcha ishlatilishi, plastik va maishiy chiqindilar ifloslantiradi.", "Ifloslangan suv ichak infeksiyalari kabi kasalliklarni tarqatadi, suv jonivorlarini nobud qiladi."] },
      { h: "Suvni qanday tejaymiz?", p: ["Tomchilatib sug'orish suvni ko'p tejaydi. Kanallarni betonlash yoki plyonka bilan qoplash sizib ketishni kamaytiradi. Uyda tomayotgan kranni tuzatish, tish yuvayotganda kranni yopish, suv hisoblagichidan foydalanish ham foydali.", "O'simliklarni erta tong yoki kechqurun sug'organ ma'qul, chunki bu paytda suv kam bug'lanadi. Jahon suv kuni — 22 mart."] }
    ],
    eslab: ["Chuchuk suv ~3%, ko'pi muzliklarda.", "Orol dengizi suv olinishi ko'payganidan qurigan, o'rnida Orolqum.", "Tomchilatib sug'orish — samarali tejash usuli.", "Jahon suv kuni — 22 mart."]
  },

  havo: {
    sarlavha: "Havo va iqlim",
    kirish: "Atmosfera bizni sovuq va nurlanishdan himoya qiladi, nafas olishimiz uchun kislorod beradi. Uning ifloslanishi va iqlim o'zgarishi bugun dunyoning eng katta muammolaridan.",
    bolimlar: [
      { h: "Havo tarkibi", p: ["Havoning taxminan 78% ini azot, 21% ini kislorod tashkil qiladi. Karbonat angidrid, argon va boshqa gazlar juda oz miqdorda.", "O'simliklar fotosintez jarayonida karbonat angidridni yutib, kislorod chiqaradi."] },
      { h: "Havo qanday ifloslanadi?", p: ["Asosiy manbalar: transport chiqindi gazlari, sanoat korxonalari, ko'mir va neft yoqilishi. Avtomobil gazlaridagi uglerod oksidi (is gazi) zaharli.", "Juda mayda chang zarrachalari (PM2.5) o'pkaga chuqur kirib, astma va bronxit kabi kasalliklarni kuchaytiradi. Havo sifati indeksi (AQI) ifloslanish darajasini ko'rsatadi.", "Oltingugurt va azot oksidlari yomg'ir suvi bilan birikib, kislotali yomg'ir hosil qiladi. U o'simlik va suv jonivorlariga zarar qiladi."] },
      { h: "Ozon qatlami", p: ["Ozon qatlami stratosferada joylashgan va bizni Quyoshning ultrabinafsha nurlaridan himoya qiladi. Freonlar (sovutgich va aerozollarda ishlatilgan) bu qatlamni yupqalashtirgan. Monreal protokoli shunday moddalarni cheklagan. Ozon qatlamini muhofaza qilish kuni — 16 sentyabr."] },
      { h: "Issiqxona effekti va global isish", p: ["Karbonat angidrid va metan atmosferada issiqlikni ushlab qoladi. Bu tabiiy jarayon, lekin ko'mir, neft va gaz yoqilishi gazlarni ko'paytirib, global isishga olib kelmoqda. Oqibatlari: muzliklarning erishi, dengiz sathining ko'tarilishi, qurg'oqchilik va issiqlik to'lqinlari.", "Parij kelishuvi va Kioto protokoli issiqxona gazlarini kamaytirishga qaratilgan. Har birimiz energiyani tejab, jamoat transporti yoki velosipeddan foydalanib hissa qo'sha olamiz."] }
    ],
    eslab: ["Havo: ~78% azot, ~21% kislorod.", "Ozon qatlami ultrabinafsha nurdan himoya qiladi, freon uni yemiradi.", "CO₂ va metan global isishga sabab.", "Daraxtlar changni ushlaydi va kislorod beradi."]
  },

  chiqindi: {
    sarlavha: "Chiqindilar bilan to'g'ri ishlash",
    kirish: "Har yili odamlar juda ko'p chiqindi hosil qiladi. Chiqindi tuproq, suv va havoni ifloslantiradi, lekin to'g'ri yo'lga qo'yilsa, ko'pi yana foydali xomashyoga aylanadi.",
    bolimlar: [
      { h: "3R qoidasi", p: ["Chiqindi bilan ishlashning asosiy qoidasi — 3R: Kamaytir (Reduce), Qayta ishlat (Reuse), Qayta ishla (Recycle). Eng muhimi — birinchisi: chiqindini umuman kamaytirish.", "Masalan, bir martalik plastik paket o'rniga mato sumka, plastik butilka o'rniga ko'p marta ishlatiladigan idish tanlash mumkin."] },
      { h: "Saralash", p: ["Chiqindini turlari bo'yicha ajratib yig'ish (qog'oz, plastik, shisha, metall, organik) qayta ishlashni osonlashtiradi. Qayta ishlashga topshirishdan oldin idishlarni chayib tashlash kerak.", "Qog'ozni qayta ishlash daraxtlarni, alyuminiy bankalarni qayta ishlash esa ko'p energiyani tejaydi. Shishani sifatini yo'qotmay ko'p marta qayta ishlash mumkin."] },
      { h: "Organik chiqindi va kompost", p: ["Meva-sabzavot po'choqlari, barglar, choy qoldig'i organik chiqindi. Ular chirib, kompost — tabiiy o'g'it hosil qiladi. Plastik, shisha va metall kompostga solinmaydi.", "Chiqindi poligonlarida organik moddalar chiriganda metan ajraladi. Bu gaz issiqxona effektini kuchaytiradi. Organik chiqindidan biogaz ham olish mumkin."] },
      { h: "Xavfli chiqindilar", p: ["Batareyalar, akkumulyatorlar, simobli lampalar, eskirgan dori-darmon va elektron asboblar xavfli chiqindi. Ularni oddiy axlatga tashlab bo'lmaydi, maxsus qabul punktlariga topshirish kerak.", "Plastik tabiatda yuzlab yil parchalanadi. Maydalangan plastik zarralari (mikroplastik, 5 mm dan kichik) suv va tuproqqa tushib, jonivorlar tanasiga kiradi. Banan po'chog'i esa bir necha hafta-oyda chirib ketadi."] }
    ],
    eslab: ["3R: kamaytir, qayta ishlat, qayta ishla.", "Chiqindini saralab, idishni chayib topshirish kerak.", "Organik chiqindidan kompost va biogaz olinadi.", "Batareya va lampalar — maxsus punktlarga."]
  },

  tabiat: {
    sarlavha: "Biologik xilma-xillik",
    kirish: "Biologik xilma-xillik — Yerdagi barcha tirik organizmlar turlarining, ularning genlari va ekotizimlarining xilma-xilligi. U qanchalik boy bo'lsa, tabiat shunchalik barqaror.",
    bolimlar: [
      { h: "Nega xilma-xillik muhim?", p: ["Har bir tur oziq zanjirida o'z o'rniga ega. O'rmonlar kislorod beradi va CO₂ni yutadi, hasharotlar o'simliklarni changlatadi, tuproq mikroorganizmlari organik qoldiqlarni chiritib tuproqni boyitadi.", "Dunyoda turlarga eng boy joylar — tropik yomg'ir o'rmonlari. Xalqaro biologik xilma-xillik kuni — 22 may."] },
      { h: "Turlar nima uchun yo'qolmoqda?", p: ["Asosiy sabab — yashash joylarining yo'qolishi (o'rmon kesish, quritish, shaharlar kengayishi). Boshqa sabablar: brakonerlik (noqonuniy ov), ifloslanish, iqlim o'zgarishi va boshqa joydan kirib kelgan invaziv turlar.", "Yo'qolish xavfi ostidagi turlar Qizil kitobga kiritiladi va ularni ovlash taqiqlanadi."] },
      { h: "Tabiatni qanday asraymiz?", p: ["Qo'riqxonalar, milliy bog'lar va tabiat yodgorliklari tashkil etiladi. Daraxt va o'simliklar ekish tuproq eroziyasini kamaytiradi. Sayohatda chiqindini o'zingiz bilan olib ketish, yovvoyi hayvonlarni uyda saqlamaslik, bahorda qushlarning uyalariga zarar yetkazmaslik muhim."] }
    ],
    eslab: ["Xilma-xillik qancha boy, ekotizim shuncha barqaror.", "Asosiy xavf — yashash joylarining yo'qolishi.", "Qizil kitob yo'qolish xavfi ostidagi turlar ro'yxati.", "Xalqaro biologik xilma-xillik kuni — 22 may."]
  },

  tuproq: {
    sarlavha: "Tuproq va yer resurslari",
    kirish: "Tuproqning eng muhim xususiyati — unumdorlik, ya'ni o'simliklarni oziq moddalar va suv bilan ta'minlay olishi. Tuproq asrlar davomida hosil bo'ladi, lekin tez buzilishi mumkin.",
    bolimlar: [
      { h: "Tuproq qanday hosil bo'ladi?", p: ["Tog' jinslari shamol, suv va harorat ta'sirida maydalanadi, ustiga o'simlik va hayvon qoldiqlari chirib tushadi. Chirindi (gumus) tuproq unumdorligining asosi. Uni hosil qilishda bakteriya va zamburug'lar qatnashadi."] },
      { h: "Tuproqni nima buzadi?", p: ["Eroziya — tuproqning suv yoki shamol ta'sirida yemirilib ko'chishi. Daraxtlarni kesish, haddan ortiq o'tlatish va yerni yalang qoldirish uni kuchaytiradi.", "Sho'rlanish — tuproqda tuzlarning ko'payishi. Noto'g'ri sug'orish va yer osti suvlarining yuqoriga ko'tarilishi uni keltirib chiqaradi. Sho'r yerda hosil kamayadi.", "Cho'llanish — unumdor yerlarning cho'lga aylanishi."] },
      { h: "Tuproqni qanday asraymiz?", p: ["Tog' qiyaliklarida terrasa (zinapoya) qilish va daraxt ekish, dalalar atrofiga shamoldan himoya qiluvchi daraxt qatorlari o'tkazish eroziyani kamaytiradi. Almashlab ekish va organik o'g'itlardan foydalanish unumdorlikni saqlaydi. Mineral o'g'it va pestitsidlarni me'yorida ishlatish kerak."] }
    ],
    eslab: ["Tuproq xususiyati — unumdorlik; asosi — chirindi.", "Eroziya: suv/shamol tuproqni yuvib ketadi.", "Sho'rlanish — tuzlarning ko'payishi.", "Daraxt ekish va terrasalar tuproqni saqlaydi."]
  },

  orman: {
    sarlavha: "O'rmonlar va yashil hududlar",
    kirish: "O'rmonlar — Yerning \"o'pkasi\". Ular havoni tozalaydi, suvni saqlaydi, tuproqni himoya qiladi va ko'plab hayvonlarga makon bo'ladi.",
    bolimlar: [
      { h: "O'rmonning vazifalari", p: ["Daraxtlar fotosintezda CO₂ yutib, kislorod chiqaradi, changni ushlab qoladi, soya beradi va shovqinni kamaytiradi. Ildizlari tuproqni mustahkamlab, eroziya va sellarni to'sadi.", "O'rmon qanchalik ko'p bo'lsa, iqlim shunchalik mo'tadil va suv zaxiralari barqaror bo'ladi."] },
      { h: "O'zbekistonda yashil hududlar", p: ["O'zbekiston o'rmonlari kam, shuning uchun har bir daraxt qadrli. Tog'larda archa (Turkiston archasi — sekin o'suvchi ignabargli daraxt), daryo bo'ylarida to'qay o'rmonlari uchraydi. Cho'lda saksovul qumni mustahkamlaydi.", "Orol dengizining qurigan tubida chang-tuz ko'tarilishini kamaytirish uchun saksovul kabi cho'l o'simliklari ekilmoqda."] },
      { h: "O'rmonga xavf", p: ["Noqonuniy kesish, o'rmon yong'inlari, haddan ortiq o'tlatish va qurg'oqchilik o'rmonlarga zarar yetkazadi. Yong'in hayvonlar uyini yo'q qiladi va havoga ko'p tutun chiqaradi.", "Har birimiz ko'chat ekib, hasharda qatnashib, tabiatda gulxanni to'liq o'chirib ketib hissa qo'sha olamiz."] }
    ],
    eslab: ["Daraxtlar CO₂ yutadi, kislorod beradi, changni ushlaydi.", "Ildizlar tuproqni mustahkamlaydi.", "Saksovul — cho'lda qumni mustahkamlovchi o'simlik.", "Tabiatda gulxanni to'liq o'chiring."]
  },

  energiya: {
    sarlavha: "Energiya va uni tejash",
    kirish: "Uy, zavod, transport — hammasi energiya talab qiladi. Energiya manbalari qayta tiklanuvchi va qayta tiklanmaydigan turlarga bo'linadi.",
    bolimlar: [
      { h: "Energiya manbalari", p: ["Qayta tiklanmaydigan manbalar: ko'mir, neft, tabiiy gaz (qazilma yoqilg'i). Ular millionlab yillar davomida qadimgi organizm qoldiqlaridan hosil bo'lgan va tugab boradi. Yonganda CO₂ chiqaradi.", "Qayta tiklanuvchi manbalar: Quyosh, shamol, oqar suv (GES), biogaz, bioyoqilg'i. Ular tugamaydi va havoni kam ifloslantiradi."] },
      { h: "Afzallik va kamchiliklar", p: ["Quyosh paneli Quyosh nurini elektr energiyasiga aylantiradi. O'zbekistonda quyoshli kunlar ko'p, shuning uchun qulay. Kamchiligi — kechasi va bulutli kunda kam elektr beradi. Shamol stansiyalari shamol kuchli esadigan ochiq joylarga quriladi. GES daryo rejimi va baliqlar ko'chishiga ta'sir qilishi mumkin.", "Atom stansiyasi CO₂ kam chiqaradi, lekin radioaktiv chiqindini xavfsiz saqlash muammosi bor."] },
      { h: "Energiyani tejash", p: ["Xonadan chiqqanda chiroqni o'chirish, LED lampalar, A+++ yorlig'idagi maishiy texnika, uyni issiqlikdan izolyatsiya qilish, ishlatilmayotgan asboblarni rozetkadan uzish (kutish rejimida ham elektr sarflanadi), muzlatgich eshigini uzoq ochiq qoldirmaslik energiyani tejaydi.", "Jamoat transporti va velosiped yoqilg'i sarfini va chiqindi gazlarni kamaytiradi. Elektromobil yurganda egzoz gazi chiqarmaydi. Elektr energiyasi kilovatt-soatda hisoblanadi."] }
    ],
    eslab: ["Ko'mir, neft, gaz — tugaydi; Quyosh, shamol, suv — tugamaydi.", "LED lampa elektrni eng kam sarflaydi.", "Kutish rejimida ham elektr sarflanadi.", "Elektr birligi — kilovatt-soat."]
  },

  muhofaza: {
    sarlavha: "O'zbekiston tabiati va muhofaza etiladigan hududlar",
    kirish: "O'zbekiston hududida cho'llar, tog'lar, daryo vodiylari va to'qay o'rmonlari bor. Noyob tur va manzaralarni asrash uchun muhofaza etiladigan hududlar tashkil etilgan.",
    bolimlar: [
      { h: "Tabiat zonalari", p: ["Eng katta cho'l — Qizilqum. Ustyurt platosi Qoraqalpog'iston Respublikasida joylashgan. Orol dengizi o'rnida Orolqum cho'li paydo bo'lgan. O'zbekistonning eng baland cho'qqisi — Xazrati Sulton. Chorvoq — Toshkent viloyatidagi suv ombori va dam olish hududi."] },
      { h: "Muhofaza etiladigan hududlar", p: ["Qo'riqxona — tabiiy majmua xo'jalik faoliyatidan to'liq muhofaza qilinadigan hudud. Unda ov qilish, daraxt kesish va o'simlik terish taqiqlanadi. Milliy bog' — tabiatni muhofaza qilish bilan birga ekoturizm va dam olish uchun mo'ljallangan hudud. Tabiat yodgorligi — noyob tabiiy obyekt (buloq, g'or, qadimiy daraxt).", "Qo'riqxonalar: Zomin (Jizzax viloyati), Chatqol biosfera qo'riqxonasi (Toshkent viloyati), Hisor (Qashqadaryo viloyati), Surxon (Surxondaryo viloyati), Badai-Tugay (Amudaryo bo'yida)."] },
      { h: "Noyob hayvonlar", p: ["Qor qoploni baland tog'larda yashaydi. Buxoro bug'usi (xongul) daryo bo'yidagi to'qay o'rmonlarida uchraydi. Jayron cho'l va chala cho'lda yashaydigan antilopa. Turon yo'lbarsi XX asrda qirilib ketgan hisoblanadi.", "Yo'qolish xavfi ostidagi turlar Qizil kitobga kiritiladi. Xalqaro Qizil ro'yxatni IUCN yuritadi."] },
      { h: "Ekoturizm va muhim sanalar", p: ["Ekoturizm — tabiatga zarar yetkazmay, uni asrab sayohat qilish.", "Muhim sanalar: Navro'z — 21 mart, Yer kuni — 22 aprel, Biologik xilma-xillik kuni — 22 may, Atrof-muhit kuni — 5 iyun, Ozon qatlamini muhofaza qilish kuni — 16 sentyabr, Butunjahon hayvonlar kuni — 4 oktyabr."] }
    ],
    eslab: ["Qo'riqxonada ov, daraxt kesish, o'simlik terish taqiqlanadi.", "Milliy bog' — muhofaza + ekoturizm.", "Eng katta cho'l — Qizilqum.", "Qizil kitob — yo'qolish xavfidagi turlar ro'yxati."]
  },

  salomat: {
    sarlavha: "Ekologiya va inson salomatligi",
    kirish: "Toza havo, toza suv va xavfsiz oziq-ovqat salomatlikning asosi. Atrof-muhit ifloslansa, avvalo inson o'zi zarar ko'radi.",
    bolimlar: [
      { h: "Havo va salomatlik", p: ["Ifloslangan havo nafas yo'llari kasalliklarini (astma, bronxit) kuchaytiradi, ayniqsa bolalar va keksalarga xavfli. Chekish va passiv chekish ham zarar qiladi. Uy-xonalarni muntazam shamollatish kerak."] },
      { h: "Suv va oziq-ovqat", p: ["Ifloslangan suv ichak infeksiyalarini tarqatadi. Ichimlik suvini qaynatish yoki tozalash xavfsizroq. Sabzavot va mevalarni yaxshilab yuvib iste'mol qilish, pestitsid va o'g'itlarni me'yorida ishlatish zarar kamaytiradi."] },
      { h: "Shovqin, nurlanish va Orolbo'yi", p: ["Doimiy kuchli shovqin asabni charchatadi va eshitishga zarar qiladi. Daraxtlar shovqinni kamaytiradi.", "Orol dengizi qurigach, Orolbo'yida tuzli chang bo'ronlari va ichimlik suvi sifati salomatlikka salbiy ta'sir ko'rsatmoqda. Bu ekologik muammo to'g'ridan-to'g'ri insonga zarar yetkazishining yorqin misolidir."] },
      { h: "Sog'lom turmush tarzi", p: ["Ko'proq piyoda yurish va velosiped, ko'kalamzor joylarda dam olish, jismoniy faollik, toza muhit yaratishda qatnashish salomatlikni mustahkamlaydi. Tibbiy chiqindi va dori-darmonni to'g'ri utilizatsiya qilish ham atrof-muhit va salomatlikni asraydi."] }
    ],
    eslab: ["Ifloslangan havo nafas yo'llariga zarar qiladi.", "Ichimlik suvini qaynatib yoki tozalab iching.", "Daraxtlar changni va shovqinni kamaytiradi.", "Orolbo'yi — ekologiya va salomatlik aloqasiga misol."]
  },

  huquq: {
    sarlavha: "Ekologik madaniyat va xalqaro hamkorlik",
    kirish: "Ekologik madaniyat — insonning tabiatga mas'uliyatli munosabati va bilimi. Ko'p muammolar bir davlat chegarasida to'xtamaydi, shuning uchun xalqaro hamkorlik kerak.",
    bolimlar: [
      { h: "Barqaror rivojlanish", p: ["Barqaror rivojlanish — kelajak avlodlar ehtiyojiga zarar yetkazmay, hozirgi ehtiyojlarni qondirish. BMT 17 ta Barqaror rivojlanish maqsadini belgilagan. Yashil iqtisodiyot resurs sarfi va zararni kamaytiradi, aylanma iqtisodiyotda esa resurslar qayta ishlatilib, chiqindi minimal bo'ladi."] },
      { h: "Muhim xalqaro hujjatlar va tashkilotlar", p: ["1972-yil Stokgolm — BMTning birinchi yirik atrof-muhit konferensiyasi. 1992-yil Rio-de-Janeyro — atrof-muhit va rivojlanish bo'yicha BMT konferensiyasi.", "Kioto protokoli issiqxona gazlarini kamaytirishga, Parij kelishuvi (2015) global isishni 2 °C dan sezilarli past, 1,5 °C ga yaqin ushlashga qaratilgan. Monreal protokoli ozon qatlamini yemiruvchi moddalarni cheklaydi. CITES yo'qolish xavfidagi turlar savdosini, Ramsar botqoq hududlarni, Bazel xavfli chiqindilarning davlatlararo tashilishini tartibga soladi.", "UNEP — BMT Atrof-muhit dasturi. IPCC — iqlim o'zgarishi bo'yicha hukumatlararo ekspertlar guruhi. COP — BMT iqlim bo'yicha davlatlarning yillik anjumani. WWF belgisida panda tasvirlangan."] },
      { h: "Qonun va javobgarlik", p: ["O'zbekiston Konstitutsiyasiga ko'ra, fuqarolar atrof tabiiy muhitga ehtiyotkorona munosabatda bo'lishi shart. Atrof-muhitni ifloslantirganlik uchun ma'muriy yoki jinoiy javobgarlik nazarda tutilgan. \"Ifloslantiruvchi to'laydi\" tamoyiliga ko'ra, zarar yetkazgan uni qoplaydi. Ekologik ekspertiza loyihaning atrof-muhitga ta'sirini oldindan baholaydi, ekologik monitoring esa muhit holatini doimiy kuzatadi."] },
      { h: "Har kimning hissasi", p: ["Ekologik iz — inson faoliyatining tabiiy resurslarga ta'sirini o'lchash ko'rsatkichi. Uni kamaytirish uchun chiqindini saralash, energiya va suvni tejash, mato sumkadan foydalanish, hasharda qatnashish mumkin. \"Yer soati\" aksiyasida bir soat chiroq va keraksiz elektr asboblari o'chiriladi."] }
    ],
    eslab: ["Barqaror rivojlanish: kelajak avlod ehtiyojini ham hisobga olish.", "Kioto — issiqxona gazlari, Monreal — ozon, CITES — turlar savdosi.", "Ifloslantiruvchi to'laydi.", "Ekologik iz — resurslarga ta'sir o'lchovi."]
  }
};
