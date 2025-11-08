
var swiper = new Swiper(".swiper", {
  slidesPerView: 5,
  centeredSlides: false,
  spaceBetween: 0,
  fade: 'true',
  grabCursor: 'true',
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});


// function to get a Album
async function getAlbum() {

  let album_fetch = await fetch("/media/Album/")
  let response = await album_fetch.text()
  // console.log(response);
  let div = document.createElement("div")

  div.innerHTML = response
  let c = div.getElementsByClassName("name")
  let album_name = []
  for (let i = 0; i < c.length; i++) {

    if (c[i].innerHTML == "..") {

    }
    else {
      album_name.push(c[i].innerHTML);
    }

  }
  return album_name;

}



async function getAlbumSong(folder) {
  // console.log(folder);

  let al_SongFetch = await fetch(`/media/Album/${folder}/`)
  let response = await al_SongFetch.text()
  // console.log(response);

  let div2 = document.createElement("div")
  // console.log(div2);

  div2.innerHTML = response
  album_songs = []
  let d = div2.getElementsByTagName("a")

  //  this is a which is inside text file we get as response
  for (let j = 0; j < d.length; j++) {
    if (d[j].href.endsWith("mp3")) {
      album_songs.push(d[j].href);

    }

  }
  // console.log(album_songs);

  return album_songs

}




// function to get a song
async function getSongs() {

  let songs_fetch = await fetch("/media/zayn/")
  let response = await songs_fetch.text()
  // console.log(response);

  let div = document.createElement("div")
  div.innerHTML = response
  songs = []
  let a = div.getElementsByTagName("a")
  //  this is a which is inside text file we get as response
  // console.log(response);

  for (let index = 0; index < a.length; index++) {
    const elem = a[index];
    if (elem.href.endsWith(".mpeg")) {
      songs.push(elem.href)
    }

  }
  // console.log(songs);

  return songs

}


async function main() {
  let folder;
  let song_array = await getSongs()
  let album_array = await getAlbum()
  // let album_songs = await getAlbumSong(folder)
  let Album_card = ""
  let html = ""
  let playlist_card = ""

  // function to create a card
  function CreateCard(song, artist_name, song_name,cover) {

    html += `
                        <div class="card swiper-slide ">
                            <img src="${cover}" >    
                            <div class="play">
                                <button id="playing_song" src="${song}">
                                    <img src="svg/play.svg" class="hello">
                                </button>
                            </div>
                            <div class="artist_info">
                                <p>${artist_name}</p>
                                <p>${song_name}</p>
                        
                            </div>

                        </div>`

  }

  // function for all artist and song details  
  function artist_info(song) {
    let artist = song.split("/").pop().split(".")[0];
    let song_name = decodeURI(artist.split("-")[0]);
    let artist_name = decodeURI(artist.split("-")[1]);
    // console.log(song_name, artist_name);
    return { song_name, artist_name }
  }

 let albumCovers = {
  "Zayn": "gallery/zayn.jfif",
  "Shubh": "gallery/Shubh.jfif",
  "Talha Anjum": "gallery/TalhaAnjum.jpg",
  "Atif": "gallery/ATIF.png",
  "One Direction": "gallery/OneDirection.jpg"
};



  function CreateAlbumCard(a,cover) {
    

    Album_card += `
                        <div class="card swiper-slide pl_card">
                            <img src="${cover}" class="cover_al" >

                            <p>${a}</p>

                        </div>`
    // console.log(Album_card);
    

  }

  album_array.forEach((a) => {  
    let cover= albumCovers[a]  
    CreateAlbumCard(a,cover)
    document.querySelector(".pl_album").innerHTML = Album_card
  })




  let pl_cards = document.querySelectorAll(".pl_card")
  pl_cards.forEach((a) => {
    a.addEventListener("click", async () => {
      folder = encodeURI(a.lastElementChild.innerHTML); // store globally
      let album_songs = await getAlbumSong(folder);// updates global album_songs array
      playlist_card = ""
      for (const song of album_songs) {

        let artist_det = song.split("/")[6].split("-");
        let singer = decodeURI(song.split("/")[6].split("-")[0]);
        let song_name = decodeURI(song.split("/")[6].split("-")[1].split(".mp3"));
        //  console.log(singer, song_name);

        create_pl_card(song, singer, song_name)

      }
      let song_uL = document.querySelector(".two")

      song_uL.innerHTML = playlist_card
      ShowingParts(playlist_card)
      let song_lk = document.querySelectorAll(".pl_play")
      for (let k = 0; k < song_lk.length; k++) {
        const element = song_lk[k];
        element.addEventListener("click", () => {
          let songsrc = element.getAttribute("src");
          playSong(songsrc)
        })
      }
    })

  })

  function create_pl_card(song, singer, song_name) {
    playlist_card += `
                <ul class="list">
                    <li class="list_play">
                         <button class="pl_play" src="${song}">
                         <img src="svg/play.svg" class="invert">
                         </button>
                    </li>
                        <li class="Song_name">${singer}</li >
                        <li class="Singer">${song_name}</li>
                </ul>
    `
    return playlist_card;

  }

  // function for current artist and song details
  function Current_artist(currentsong) {
    currentsong_src = currentsong.src
    let C_artist = currentsong_src.split("/").pop().split(".")[0];
    let current_song = decodeURI(C_artist.split("-")[0]);
    let current_artist = decodeURI(C_artist.split("-")[1]);
    document.querySelector(".information").firstElementChild.innerHTML = current_song
    document.querySelector(".information").lastElementChild.innerHTML = current_artist
    // document.querySelector(".info").firstElementChild.innerHTML = current_song
    // document.querySelector(".info").lastElementChild.innerHTML = current_artist
    // console.log(current_song,current_artist);

    // let Cover_pic = document.querySelector("#info")

    cover_thumbnail(current_artist)

  }

  function cover_thumbnail(current_artist) {
    let Thumbnail_bar = document.querySelector("#Thumbnail_bar")

  //  console.log(current_artist);

    if (current_artist == "Zayn") {
      // Cover_pic.src = "/gallery/zayn.jpeg"
      Thumbnail_bar.src = "/gallery/zayn.jpeg"

    }
    else if (current_artist == "Shubh") {
      // Cover_pic.src = "/gallery/Shubh.jfif"
      Thumbnail_bar.src = "/gallery/Shubh.jfif"

    } else if (current_artist == "Talha Anjum") {
      // Cover_pic.src = "/gallery/TalhaAnjum.jpg"
      Thumbnail_bar.src = "/gallery/TalhaAnjum.jpg"
    }

    else if (current_artist == "Talha Anjum") {
      // Cover_pic.src = "/gallery/TalhaAnjum.jpg"
      Thumbnail_bar.src = "/gallery/musicLogo.png"
    }
    else if (current_artist == "justin Bieber") {
      // Cover_pic.src = "/gallery/TalhaAnjum.jpg"
      Thumbnail_bar.src = "/gallery/justin.png"
    }
  }



  function ShowingParts(playlist_card) {

    if (playlist_card.innerHTML == " ") {
      document.querySelector(".part1").style.display = "block"

      document.querySelector(".part3").style.display = "none"
    }
    else {
      document.querySelector(".part1").style.display = "none"
      document.querySelector(".part3").style.display = "block"
    }

  }

  // loop for taking a song from a song array
  for (const song of song_array) {
    let { artist_name, song_name } = artist_info(song)
    cover = albumCovers[artist_name]
    
    
    CreateCard(song, artist_name, song_name,cover)
    document.querySelector(".playlist1").innerHTML = html
  }

  function progressBar(currentsong) {
    currentsong.addEventListener("loadeddata", () => {
      let duration = currentsong.duration;
      // console.log(duration);
      let minutes = Math.floor(duration / 60);
      let seconds = Math.floor(duration % 60);
      // console.log(`${minutes}:${seconds} `);
       document.querySelector("#EndTime").innerHTML = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')} `
    });


    currentsong.addEventListener("timeupdate", () => {
      let duration = currentsong.duration;
      let currDuration = currentsong.currentTime;
      console.log(duration,currDuration);
      let minutes = Math.floor(currDuration / 60);
      let seconds = Math.floor(currDuration % 60);
      // console.log(`${minutes}:${seconds} `);
      document.querySelector("#currentTime").innerHTML = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')} `

      document.querySelector(".circle").style.left=(currDuration/duration)*100 + "%"

    });
//  formatted = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`

  }


  let getSong_Links = document.querySelectorAll("#playing_song")
  for (let index = 0; index < getSong_Links.length; index++) {
    getSong_Links[index].addEventListener("click", () => {
      let songSrc = getSong_Links[index].getAttribute("src")

      playSong(songSrc)
    })

  }


  let currentsong = new Audio()


  function playSong(songSrc) {
    // console.log(songSrc);
    currentsong.src = songSrc
    currentsong.play()
    Current_artist(currentsong)
    progressBar(currentsong)
    // Cover(currentsong)
  }

  let playBtn = document.querySelector("#playBtn")
  document.querySelector(".Song_play").addEventListener("click", () => {
    if (currentsong.paused) {
      playBtn.src = "svg/pause.svg"
      currentsong.play()

    }
    else {
      playBtn.src = "svg/Plays.svg"
      currentsong.pause()
    }
  })


}


main()
