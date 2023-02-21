import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js'
import { getDatabase, ref, child, get } from 'https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js'
import { getStorage, ref as sref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js'

const familyList = {
    data() {
        return {
            currentFamily: 1,
            recom: 1,
            data: []
        }
    },
    methods: {
        setData(data) {
            this.data = data
        }
    }
}

const app = Vue.createApp(familyList)

const vm = app.mount('#family-introductions')

const firebaseConfig = {
    apiKey: "AIzaSyAgPNVexDd8akOu-BdNyyoRomU6EV7RL04",
    authDomain: "amakarafamily-e921b.firebaseapp.com",
    databaseURL: "https://amakarafamily-e921b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "amakarafamily-e921b",
    storageBucket: "amakarafamily-e921b.appspot.com",
    messagingSenderId: "768345263947",
    appId: "1:768345263947:web:e1fbe165ddea4e725fa2ce"
};

// https://youtu.be/lHz6YhYUTzU
const fapp = initializeApp(firebaseConfig);
const database = getDatabase(fapp);

const dbRef = ref(database);
get(child(dbRef, `data`)).then((snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val().map(data => {
            data.elId = data.reading.replace(/\s+/g, "").toLowerCase()
            data.mid = data.elId + "-m"
            data.tid = data.elId + "-tatie"
            data.sid = data.elId + "-sumnail"
            data.mtid = data.elId + "-tatie-m"
            data.msid = data.elId + "-sumnail-m"
            data.tatie = "images/" + data.elId + "_tatie.webp"
            data.sumnail = "images/" + data.elId + "_sumnail.webp"
            data.youtube1 = "https://www.youtube.com/embed/" + data.youtube1.split("/")[3]
            data.youtube2 = "https://www.youtube.com/embed/" + data.youtube2.split("/")[3]
            data.amkl = data.id <= 2
            downloadImage(data.tatie, data.tid)
            downloadImage(data.sumnail, data.sid)
            return data
        })
        vm.setData(data)
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});

const storage = getStorage();
const downloadImage = (path, id) => {
    getDownloadURL(sref(storage, path))
        .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            // Or inserted into an <img> element
            const img = document.getElementById(id);
            img.setAttribute('src', url);

            const imgm = document.getElementById(id + "-m");
            imgm.setAttribute('src', url);
        })
        .catch((error) => {
            // Handle any errors
            console.log(error)
        });
}

downloadImage("images/tatie_bg.webp", "tatie-bg1")
downloadImage("images/tatie_bg.webp", "tatie-bg2")