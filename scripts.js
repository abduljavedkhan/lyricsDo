const apiURL = 'https://api.lyrics.ovh';
const cors = 'https://cors-anywhere.herokuapp.com';
const headerParams = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json', 'X-Requested-With': 'xhr' };
let nextPageUrl = '';
let prevPageUrl = '';
const search = document.getElementById('songsearch')
const form = document.querySelector('#searchForm');
document.getElementById('btn_prev').style.display = 'none';
document.getElementById('btn_next').style.display = 'none';
document.getElementById('loader').style.display = 'none';


// search song based on keyword
form.addEventListener('submit', function (e) {
    e.preventDefault();
    searchKeyword = search.value.trim();
    document.getElementById('result').style.display = 'none';
    document.getElementById('loader').style.display = 'initial';
    if (!searchKeyword) { alert("No keywords to search") }
    else { 
        searchSong(searchKeyword) }
});

// search song API call
const searchSong = async (searchKeyword) => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('result').style.display = 'initial';
    try {
        const res = await fetch(`${apiURL}/suggest/${searchKeyword}`);
        const data = await res.json();
        nextPageUrl = data.next;
        if(nextPageUrl){
          
            document.getElementById('btn_next').style.display = 'initial';
        }
        document.getElementById('loader').style.display = 'none';
        showData(data);
        
    } catch (e) {
        console.log('something went wrong', e);
    }
}

// render response data of searched keyword
function showData(data) {

    result.innerHTML = `<ul class="song-data">
                        ${data.data.map(song =>
                        `<li>
                            <div>
                                <strong>${song.artist.name}</strong> -${song.title} 
                            </div>
                            <span artist="${song.artist.name}" songtitle="${song.title}"> Show Lyrics</span>
                        </li>`).join('')
                        }</ul>`;
 }

// show lyrics 
result.addEventListener('click', e => {
    
    const clickedElement = e.target;
    if (clickedElement.tagName === 'SPAN') {
        const artist = clickedElement.getAttribute('artist');
        const songTitle = clickedElement.getAttribute('songtitle');
        showLyrics(artist, songTitle)
    }
});

// lyrics api call
async function showLyrics(artist, songTitle) {
    document.getElementById('result').style.display = 'none';
    document.getElementById('loader').style.display = 'initial';
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    document.getElementById('loader').style.display = 'none';
    document.getElementById('result').style.display = 'initial';
    result.innerHTML =
     `<h2><strong>${artist}</strong> - ${songTitle}</h2>
      <p>${lyrics}</p>`;
}


let countPage=0;

// pagination API call on click
//next page
async function nextPage() {
  if (!nextPageUrl) {
    if (!search.value) { alert("Type a keyword to search") }
else{
        alert('No records to show ');
    }} else {
        document.getElementById('result').style.display = 'none';
        document.getElementById('loader').style.display = 'initial';
        countPage++;
        try { 
                       
            fetch(`${cors}/${nextPageUrl}`, headerParams)
              .then(response => response.text())
              .then(res => {
                const jdata = JSON.parse(res);
                prevPageUrl = jdata.prev;
                nextPageUrl = jdata.next;
                document.getElementById('loader').style.display = 'none';
                document.getElementById('result').style.display = 'initial';
                if(prevPageUrl){
                    document.getElementById('btn_prev').style.display = 'initial';
                }
                if(nextPageUrl){
                    document.getElementById('btn_next').style.display = 'initial';
                }
                showData(jdata);
              })
              .catch(error => console.log('error', error));
        } catch (e) {
            console.log('something went wrong on clicking next', e);
        }
    }
}


// prev page
async function prevPage() {
    if (!prevPageUrl) {
        if (!search.value) { alert("Type a keyword to search") }
        else{
                alert('No records to show ');
            }
    } else {
        if(countPage === 0){
            document.getElementById('btn_prev').style.display = 'none';
        }else{
            document.getElementById('loader').style.display = 'initial';
            document.getElementById('result').style.display = 'none';
            countPage--;
        try {
            fetch(`${cors}/${prevPageUrl}`, headerParams)
              .then(response => response.text())
              .then(res => {
                const jdata = JSON.parse(res);
                document.getElementById('loader').style.display = 'none';
                document.getElementById('result').style.display = 'initial';
                showData(jdata);
              })
              .catch(error => console.log('error', error));
        } catch (e) {
            console.log('something went wrong on clicking prev', e);
        }}
    }
}


//module.exports = searchSong;