## dokumentasi

#### tentang saltik
saltikjs adalah sebuah library yang berguna untuk mendeteksi salah kata pada editor.

#### cara penggunaan
install terlebih dahulu saltikjs dengan menggunakan perintah `npm i install saltik`. Lalu panggil file saltik.css dan saltik.js pada nodel_modules.

```html
<link rel="stylesheet" href="node_modules/saltik/saltik.css">
<script type="text/javascript" src="node_modules/saltik/saltik.js"></script>

```

untuk membuat layout editor kodenya seperti ini.

```html
<div class="toolbar">
	<button class="button" id="clear">Clear Mark</button>
	<button class="button" id="saltikCheck">check typo</button>
</div>
<div id="editor" contenteditable="plaintext-only"></div>
```

#### membuat data kamus
untuk pembuatan data kamus, kamu bisa membuat dengan format data array biasa.

```javscript
var dictionary = ["aku","mau",lulus","amin"];
```

jika tidak mau ribet untuk urusan membuat data kamus maka tinggal memanggil file dictionary.js yang sudah disediakan oleh library

```html
<script type="text/javascript" src="node_modules/saltik/dictionary.js"></script>
<!-- letakan diatas saltik.js -->
```

membuat code js

```javascript
let saltik = new Saltik("#editor",dictionary);

document.querySelector("#saltikCheck").onclick = event => {
	saltik.run();
}
document.querySelector("#clear").onclick = event => {
	saltik.clear();
}
```

terdapat 2 method yang bisa panggil yaitu : 

|  method | cara panggil | fungsi |
| :------------ | :------------ | :------------ |
|  run() | saltik.run(empty) | untuk menjalankan fungsi saltik |
|   clear() | saltik.clear(empty) | untuk menghapus element mark yang berattribut correction pada editor|



#### batasan library
1. untuk saat ini saltik hanya bisa mencari kata yang salah pada editor dengan ketentuan regex yang telah ditetapkan dan mendeteksi kemiripan kata yang salah dengan kata pada kamus masih menggunakan algoritma Levenshtein.
2. masih menggunakan element yang berattribute contenteditable plaintext-only.

#### doakan aku biar lulus ujian dan dapatkan gelar s.kom, dengan begitu aku akan melanjutkan saltik.js kedapanya :')