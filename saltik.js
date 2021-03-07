class Saltik{

	constructor(editor, dictionary){
		this.cond = this.#condition(editor,dictionary);

		if( this.cond ){
			this.editor		= document.querySelector(editor);			
			this.dictionary	= this.#getDictionary(dictionary);
		}
	}

	// check type parameter of constructor (editor)
	#conditionEditor(editor){
		if(editor.constructor === "string".constructor){
			return true;
		}else{
			return false;
		}
	}

	// check type parameter of constructor (dictionary)
	#conditionDictionary(dictionary){
		if(dictionary === null){
			return false;
		}else if(dictionary.constructor === function(){}.constructor){
			return true;
		}else if(dictionary.constructor === [].constructor){
			return true;
		}else{
			return false;
		}
	}

	// check type parameter of constructor
	#condition(editor = null , dictionary = null){
		if(editor === null || dictionary === null){
			return false;
		}else if(this.#conditionEditor(editor) === true && this.#conditionDictionary(dictionary) === true){
			return true;
		}else{
			return false;
		}
	}

	// change textContent in editor to words
	textContent(editor){
		let node = editor.textContent;
		node = node.replace(/[,.?]/g," ");
		node = node.split(" ");// exploded textContent

		let text = [];

		// clear both
		node.forEach( word => {
			if(word !=="" && word !== ""){
				text.push( word.replace(/\s/,'') );
			}
		});

		// check for the same word in textContent
		text = text.filter( (word,index,data) => {
			return data.indexOf(word) === index;
		});

		return text;
	}

	// get dictionary
	#getDictionary(dictionary = null){

		if(dictionary !== null){
			const getType = dictionary.constructor;

			if(getType === [].constructor){// if the dictionary data types are the same, will return the value from the dictionary.
				return dictionary;
			}else if(getType === function(){}.constructor){// if the dictionary data type is a function, then the program will retrieve it based on the data sent by that function.
				return dictionary();
			}else{
				return null;
			}
		}else{
			return null;
		}
		
	}

	// remove mark in text editor
	clear(){
		var regex = new RegExp('<mark id="correction">|</mark>','gi');
		if(this.editor.innerHTML.match(regex)){
			this.editor.innerHTML = this.editor.innerHTML.replace(regex,""); 
		}
	}

	
	// check the word in the dictionary 
	checkTextInDictionary(text,dictionary){
		var correct = [];

		for(const wordText of text){
			for(const wordDictionary of dictionary){

				if( wordDictionary.toLowerCase() === wordText.toLowerCase() ){
					correct.push( wordText );
				}

			}
		}
	
		text = text.filter( word => {
			return !correct.includes( word );
		});

		return text;
	}

	// Levenshtein's algorithm which functions to find words that are similar to other words.
	#levenshtein(wordOne, wordTwo) {
		if(wordOne.length == 0) return wordTwo.length; 
		if(wordTwo.length == 0) return wordOne.length;

		// swap to save some memory O(min(wordOne,wordTwo)) instead of O(wordOne)
		if(wordOne.length > wordTwo.length) {
			var tmp = wordOne;
			wordOne = wordTwo;
			wordTwo = tmp;
		}

		var row = [];
		// init the row
		for(var i = 0; i <= wordOne.length; i++){
			row[i] = i;
		}

		// fill in the rest
		for(var i = 1; i <= wordTwo.length; i++){
			var prev = i;
			for(var j = 1; j <= wordOne.length; j++){
			var val;
			if(wordTwo.charAt(i-1) == wordOne.charAt(j-1)){
				val = row[j-1]; // match
			} else {
				val = Math.min(row[j-1] + 1, // substitution
				prev + 1,     // insertion
				row[j] + 1);  // deletion
			}
			row[j - 1] = prev;
			prev = val;
			}
			row[wordOne.length] = prev;
		}

		return row[wordOne.length];
	}

	// create saltikbox
	#saltikBox(data){

		let x = data.x;
		let y = data.y;


		const word = document.createElement('div');
		
		if(data.list.length === 0){
			word.setAttribute('class','noword');
			word.innerHTML =  "word doesn't exist";

			var list = document.createElement('p');
			list.setAttribute('style','text-align:center;');
			list.innerHTML = "no list of words";

		}else{
			word.setAttribute('class','word');
			word.innerHTML = data.list[0].word.toString();

			var list = document.createElement('ul');
			list.setAttribute('id','anotherword');

			for(const item of data.list){
				if(item.word !== word.innerHTML){
					var li = document.createElement('li');
					li.textContent = item.word;
					list.appendChild(li);
				}
			}
		}

		const saltik = document.createElement('div');
		saltik.setAttribute('id','saltik');
		saltik.setAttribute('style','left:'+x+'px; top:'+y+'px;');

		const more = document.createElement('div');
		more.setAttribute('class','more');

		const icon = document.createElement('span');
		icon.setAttribute('id','iconmore');
		icon.innerHTML = '&#8942;'; // ⋮

		const removeMark = document.createElement('span');
		removeMark.setAttribute('id','removemark');
		removeMark.innerHTML = '&#10754;'; // ⨂

		const morebox = document.createElement('div');
		morebox.setAttribute('class','morebox');
		
		const titlemorebox = document.createElement('h4');
		titlemorebox.innerHTML = "the similar word";

		morebox.append(titlemorebox,list);
		more.append(icon,morebox);
		saltik.append(more,removeMark,word);
		return document.body.append(saltik);

	}

	// find similar words
	#similarWord(typo,x,y){
		if( this.cond ){
			var no=0,
			pattern = [];
			for(let alpha of [...typo]){
				if(no++ !== 0){
					alpha = "(.*?|)"+alpha;
				}else{
					alpha = "^"+alpha;
				}
				pattern.push(alpha);
			}
			
			pattern = pattern.toString().replace(/,/g,"");
			var regex = new RegExp(pattern);
			
			var result = [];
			
			for(const word of this.dictionary){
				
				if( word.match(regex) && (word.length <= (typo.length + 4)) ){
					var rasio = this.#levenshtein(typo, word);
					result.push({ "word":word , "rasio":rasio });
				}
				
			}

			var correct = result.sort( (first,last) => {
				return first.rasio - last.rasio;
			}).slice(0,7);
			
			// return for saltikbox
			return this.#saltikBox({
				"x":x,
				"y":y,
				"list":correct
			});
		}
	}

	// event for saltikjs
	#eventHandler(){
		if( this.cond ){
			
			let position,textWithOutMark;
						
			document.onclick = event => {
				if(event.target.id === "correction" || event.target.parentNode.id === "correction"){
					if( document.querySelector("#saltik") ){
						document.querySelector("#saltik").remove();
					}

					let x = event.target.offsetLeft;
					let y = event.target.offsetTop - ( event.target.offsetHeight * 2);
					
					// --- start
					var typo = event.target.textContent;
					this.#similarWord(typo,x,y);				
					// --- end
					
					position = Array.from(event.target.parentNode.childNodes).indexOf(event.target);
					textWithOutMark = event.target.textContent;
					
				}else if(event.target.id ==="removemark"){

					var positionEditor = Array.from(event.target.parentNode.parentNode.childNodes).indexOf(this.editor);
					var parent = event.target.parentNode.parentNode.childNodes[positionEditor];
					
					parent.replaceChild(document.createTextNode(textWithOutMark),parent.childNodes[position]);
					document.querySelector("#saltik").remove();
					
				}else if(event.target.className === "word"){
					
					var positionEditor = Array.from(event.target.parentNode.parentNode.childNodes).indexOf(this.editor);
					var parent = event.target.parentNode.parentNode.childNodes[positionEditor];
					
					parent.replaceChild(document.createTextNode(event.target.textContent),parent.childNodes[position]);
					document.querySelector("#saltik").remove();
					
				}else if(event.target.id === "iconmore"){
					
					document.querySelectorAll("#saltik .more .morebox").forEach( target =>{
						target.classList.toggle("show");
					});

				}else if(event.target.parentNode.id === "anotherword" && event.target.localName === "li"){

					var positionEditor = Array.from(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes).indexOf(this.editor);
					var parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[positionEditor];

					parent.replaceChild(document.createTextNode(event.target.textContent),parent.childNodes[position]);
					document.querySelector("#saltik").remove();					

				}else{

					if( document.querySelector("#saltik") ){
						document.querySelector("#saltik").remove();
					}

				}

			};

		}		

	}

	// this is the main function of this library
	run(){
		
		if( this.cond ){
			this.clear();

			var check = this.checkTextInDictionary( this.textContent(this.editor) , this.dictionary );

			for(const word of check){
				
				var regex = new RegExp(word,'gi');
				this.editor.innerHTML = this.editor.innerHTML.replace(regex,'<mark id="correction">'+word+'</mark>');
				
			}
			
			this.#eventHandler();
		}

	}
}