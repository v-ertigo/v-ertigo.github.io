window.addEventListener("DOMContentLoaded", () => {

  let playlist = [
  {name: "bus pass - fog", src: "assets/music/buspass/fog.mp3"},
  {name: "bus pass - engine", src: "assets/music/buspass/engine.mp3"},
  {name: "GMTK 2026 - Unused 4, i--", src: "assets/music/UnusedSong4.mp3"},  
  {name: "GMTK 2026 - Unused 2, i--", src: "assets/music/UnusedSong2.mp3"},  
  {name: "GMTK 2026 - Unused 1, i--", src: "assets/music/UnusedSong1.mp3"},  
  {name: "Pookie's House of Frights - Temporal Transposition [Collab with Fumme]", src: "assets/music/Specimen16.mp3"},
  {name: "Pookie's House of Frights - In the Presence of a Queen [Collab with Tiescrispsnubz]", src: "assets/music/InThePresenceOfAQueen.mp3"},
  {name: "Pookie's House of Frights - Static Heaven", src: "assets/music/StaticHeaven.mp3"},
  {name: "Ambient - 060420260142", src:"assets/music/060420260142.mp3"},
  {name: "Ambient - 170520260239", src: "assets/music/170520260239.mp3"},
  {name: "Ambient - 240520260030", src: "assets/music/240520260030.mp3"},
  {name: "Ambient - 250520260248", src: "assets/music/250520260248.mp3"},
  {name: "TARTARUS - ELECTRONS BREAK", src:"assets/music/ElectronsBreak.mp3"},
  {name: "TARTARUS - ENEMY ENCOUNTERED!", src:"assets/music/EnemyEncountered.mp3"},
  {name: "Anttack - Map 02", src:"assets/music/Map02.mp3"},
  {name: "Unlabelled - Random Choir Thing", src:"assets/music/RandomOrchestralThing.mp3"},
  ];


  const audio = new Audio(),
        aPlay = document.getElementById("aPlay"),
        aPlayIco = document.getElementById("aPlayIco"),
        aNow = document.getElementById("aNow"),
        aTime = document.getElementById("aTime"),
        aSeek = document.getElementById("aSeek"),
        aVolume = document.getElementById("aVolume"),
        aVolIco = document.getElementById("aVolIco"),
        aList = document.getElementById("aList");


  for (let i in playlist) {
    let row = document.createElement("div");
    row.className = "aRow";
    row.innerHTML = playlist[i]["name"];
    row.addEventListener("click", () => audPlay(i));
    playlist[i]["row"] = row;
    aList.appendChild(row);
  }

  var audNow = 0, // current song
      audStart = true, // auto start next song

  audPlay = (idx, nostart) => {
    audNow = idx;
    audStart = nostart ? false : true;
    audio.src = encodeURI(playlist[idx]["src"]);
    for (let i in playlist) {
      if (i == idx) { playlist[i]["row"].classList.add("now"); }
      else { playlist[i]["row"].classList.remove("now"); }
    }
  };

  audio.addEventListener("canplay", () => { if (audStart) {
    audio.play();
    audStart = false;
  }});

  audio.addEventListener("ended", () => {
    audNow++;
    if (audNow >= playlist.length) { audNow = 0; }
    audPlay(audNow);
  });


  audPlay(0, true);


  audio.addEventListener("play", () => aPlayIco.innerHTML = "&#9723"); // First play, then pause
  audio.addEventListener("pause", () => aPlayIco.innerHTML = "&#9655"); // First pause, then play

  aPlay.addEventListener("click", () => {
    if (audio.paused) { audio.play(); }
    else { audio.pause(); }
  });

  var timeString = secs => {
    let ss = Math.floor(secs),
        hh = Math.floor(ss / 3600),
        mm = Math.floor((ss - (hh * 3600)) / 60);
    ss = ss - (hh * 3600) - (mm * 60);

    if (hh>0) { mm = mm<10 ? "0"+mm : mm; }
    ss = ss<10 ? "0"+ss : ss;
    return hh>0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}` ;
  };

  audio.addEventListener("loadedmetadata", () => {
    aNow.innerHTML = timeString(0);
    aTime.innerHTML = timeString(audio.duration);
  });
  
  audio.addEventListener("timeupdate", () => aNow.innerHTML = timeString(audio.currentTime));

  audio.addEventListener("loadedmetadata", () => {
    aSeek.max = Math.floor(audio.duration);

    
    var aSeeking = false; // user is now changing time
    aSeek.addEventListener("input", () => aSeeking = true); // prevents clash with (e3)
    aSeek.addEventListener("change", () => {
      audio.currentTime = aSeek.value;
      if (!audio.paused) { audio.play(); }
      aSeeking = false;
    });

    audio.addEventListener("timeupdate", () => {
      if (!aSeeking) { aSeek.value = Math.floor(audio.currentTime); }
    });
  });

       
  aVolIco.addEventListener("click", () => {
    audio.volume = audio.volume==0 ? 1 : 0 ;
    aVolume.value = audio.volume;

  });
  aVolume.addEventListener("change", () => {
    audio.volume = aVolume.value;
  });

 
  audio.addEventListener("canplay", () => {
    aPlay.disabled = false;
    aVolume.disabled = false;
    aSeek.disabled = false;
  });
  audio.addEventListener("waiting", () => {
    aPlay.disabled = true;
    aVolume.disabled = true;
    aSeek.disabled = true;
  });
});