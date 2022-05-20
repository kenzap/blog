import { getSiteId, getCookie } from '@kenzap/k-cloud';

// export const escapeHTML = (html) => {
//     escape.textContent = html;
//     return escape.innerHTML;
// }

// Parameters:
// code 								- (string) code you wish to format
// stripWhiteSpaces			- (boolean) do you wish to remove multiple whitespaces coming after each other?
// stripEmptyLines 			- (boolean) do you wish to remove empty lines?
export const formatCode = (code) => {
  
    "use strict";
    let stripWhiteSpaces = true;
    let stripEmptyLines = true;
    const whitespace = " ".repeat(2); // Default indenting 4 whitespaces
    let currentIndent = 0;
    const newlineChar = "\n";
    let prevChar = null;
    let char = null;
    let nextChar = null;

    code += '\
    ';
  
    let result = "";
    for (let pos = 0; pos <= code.length; pos++) {
      prevChar = char;
      char = code.substr(pos, 1);
      nextChar = code.substr(pos + 1, 1);
  
      const isBrTag = code.substr(pos, 4) === "<br>";
      const isOpeningTag = char === "<" && nextChar !== "/" && !isBrTag;
      const isClosingTag = char === "<" && nextChar === "/" && !isBrTag;
      const isTagEnd = prevChar === ">" && char !== "<" && currentIndent > 0;
      const isTagNext =
        !isBrTag &&
        !isOpeningTag &&
        !isClosingTag &&
        isTagEnd &&
        code.substr(pos, code.substr(pos).indexOf("<")).trim() === "";
      if (isBrTag) {
        // If opening tag, add newline character and indention
        result += newlineChar;
        currentIndent--;
        pos += 4;
      }
      if (isOpeningTag) {
        // If opening tag, add newline character and indention
        result += newlineChar + whitespace.repeat(currentIndent);
        currentIndent++;
      }
      // if Closing tag, add newline and indention
      else if (isClosingTag) {
        // If there're more closing tags than opening
        if (--currentIndent < 0) currentIndent = 0;
        result += newlineChar + whitespace.repeat(currentIndent);
      }
      // remove multiple whitespaces
      else if (stripWhiteSpaces === true && char === " " && nextChar === " ")
        char = "";
      // remove empty lines
      else if (stripEmptyLines === true && char === newlineChar) {
        //debugger;
        if (code.substr(pos, code.substr(pos).indexOf("<")).trim() === "")
          char = "";
      }
      if (isTagEnd && !isTagNext) {
        result += newlineChar + whitespace.repeat(currentIndent);
      }
  
      result += char;
    }
    // logger.log("formatHTML", {
    //   before: code,
    //   after: result,
    // });
    return escapeHTML(result);
}

export const stripHTML = (html) => {

   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

export const escapeHTML = (html) => {

    return document.createElement('div').appendChild(document.createTextNode(html)).parentNode.innerHTML;
}

export const unescapeHTML = (input) => {
    
    // const e = document.createElement('div');
    // e.innerHTML = input;

    input = input.replace(/(?:\r\n|\r|\n)/g, '');
    input = input.replace(/\s+/g, " ").trim();

    let e = document.createElement('textarea');
    e.innerHTML = input;

    let temp = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;;

    // temp = temp.replace(/(<(?!\/)[\w=\."'\s]*>) /g, "$1"); 
    // temp = temp.replace(/<p><\/p>/g, "<p> </p>");
    // temp = temp.replace(/<br([\s]*[\/]?>)/g, "");
    // temp = temp.replace(/\s+/g, " ").trim();

     temp = temp.replace(/>\s/g, '>');

    return temp;
}

export const getProductId = () => {
    
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id') ? urlParams.get('id') : "";
    return id;
}

export const getProductIdFromLink = () => {
    
    let url = new URL(window.location.href);
    let id = url.pathname.trim().split('/').slice(-2)[0];
    return id;
}

export const replaceQueryParam = (param, newval, search) => {

    let regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    let query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

export const getPageNumberOld = () => {

    let url = window.location.href.split('/');
    let page = url[url.length-1];
    let pageN = 1;
    if(page.indexOf('page')==0){
      pageN = page.replace('page', '').replace('#', '');
    }
    // console.log(pageN);
    return parseInt(pageN);
}

export const getPageNumber = () => {

    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page') ? urlParams.get('page') : 1;

    return parseInt(page);
}

export const getPagination = (meta, cb) => {

    if(typeof(meta) === 'undefined'){ document.querySelector("#listing_info").innerHTML = 'no records to display'; return; }

    let offset = meta.limit+meta.offset;
    if(offset>meta.total_records) offset = meta.total_records;

    document.querySelector("#listing_info").innerHTML = "Showing "+(1+meta.offset)+" to "+(offset)+" of "+meta.total_records+" entries";

    let pbc = Math.ceil(meta.total_records / meta.limit);
    // console.log(pbc);
    document.querySelector("#listing_paginate").style.display = (pbc < 2) ? "none" : "block";

    // page 1 

    // page 3
    // 1 2

    // page 5
    // 2 3 4 .. 

    let page = getPageNumber(); 
    let html = '<ul class="pagination d-flex justify-content-end pagination-flat">';
    html += '<li class="paginate_button page-item previous" id="listing_previous"><a href="#" aria-controls="order-listing" data-type="prev" data-page="0" tabindex="0" class="page-link"><span aria-hidden="true">&laquo;</span></li>';
    let i = 0;
    while(i<pbc){

        i++; 
        if(((i >= page-3) && (i <= page)) || ((i <= page+3) && (i >=page))){

            html += '<li class="paginate_button page-item '+((page==i)?'active':'')+'"><a href="#" aria-controls="order-listing" data-type="page" data-page="'+i+'" tabindex="0" class="page-link">'+(page==i?'..':i)+'</a></li>';      
        }
    }  
    html += '<li class="paginate_button page-item next" id="order-listing_next"><a href="#" aria-controls="order-listing" data-type="next" data-page="2" tabindex="0" class="page-link"><span aria-hidden="true">&raquo;</span></a></li>';
    html += '</ul>'

    document.querySelector("#listing_paginate").innerHTML = html;

    let page_link = document.querySelectorAll(".page-link");
    for (const l of page_link) {
        l.addEventListener('click', function(e) {

            let p = parseInt(getPageNumber());
            let ps = p;
            switch(l.dataset.type){ 
                case 'prev': p-=1; if(p<1) p = 1; break;
                case 'page': p=l.dataset.page; break;
                case 'next': p+=1; if(p>pbc) p = pbc; break;
            }
            
            // update url
            if (window.history.replaceState) {

                // let url = window.location.href.split('/page');
                // let urlF = (url[0]+'/page'+p).replace('//page', '/page');

                let str = window.location.search;
                str = replaceQueryParam('page', p, str);
                // window.location = window.location.pathname + str

                // prevents browser from storing history with each change:
                window.history.replaceState("kenzap-cloud", document.title, window.location.pathname + str);
            }

            // only refresh if page differs
            if(ps!=p) cb();
            
            e.preventDefault();
            return false;
        });
    }
}

export const formatStatus = (st) => {

    st = parseInt(st); 
    switch(st){ 
      case 0: return '<div class="badge bg-warning text-dark fw-light">Draft</div>';
      case 1: return '<div class="badge bg-primary fw-light">Published</div>';
      case 3: return '<div class="badge bg-secondary fw-light">Unpublished</div>';
      default: return '<div class="badge bg-secondary fw-light">Drafts</div>';
    }
}

export const formatTags = (tags) => {

    let html = '';
    if(tags) tags.forEach(tag => {

        html += '<div class="badge bg-light text-dark fw-light me-1">'+tag+'</div>';
    });

    return html;
}

export const formatTime = (timestamp) => {
	
    let a = new Date(timestamp * 1000);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = date + ' ' + month + ' ' + year; // + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

// nums only validation
export const numsOnly = (e, max) => {

    // Only ASCII charactar in that range allowed 
    var ASCIICode = (e.which) ? e.which : e.keyCode 
    if (ASCIICode > 31 && ASCIICode != 46 && (ASCIICode < 48 || ASCIICode > 57)) 
    return false; 

    if(parseFloat(e.target.value)>max) 
    return false; 

    let dec = e.target.value.split('.');
    if(dec.length>1)
    if(dec[1].length>1)
        return false;
    
    return true; 
}

export const onClick = (sel, fn) => {

    // console.log('onClick');
    if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

        e.removeEventListener('click', fn, true);
        e.addEventListener('click', fn, true);
    }
}

// time elapsed since creation 
export const timeConverterAgo = (now, time) => {

    // console.log(now + " " + time);

    now = parseInt(now);
    time = parseInt(time);

    // console.log(now + " " + time);

    // parse as elapsed time
    let past = now - time;
    if(past < 60) return 'moments ago';
    if(past < 3600) return parseInt(past / 60) + ' minutes ago';
    if(past < 86400) return parseInt(past / 60 / 24) + ' hours ago';

    // process as normal date
    var a = new Date(time * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year; // + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

export const makeid = (length) => {

    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

/**
 * Custom module for quilljs to allow user to drag images from their file system into the editor
 * and paste images from clipboard (Works on Chrome, Firefox, Edge, not on Safari)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
 export class ImageDrop {

	/**
	 * Instantiate the module given a quill instance and any options
	 * @param {Quill} quill
	 * @param {Object} options
	 */
	constructor(quill, options = {}) {
		// save the quill reference
		this.quill = quill;

        // TODO copy from https://github.com/NoelOConnell/quill-image-uploader/blob/master/src/quill.imageUploader.js
        // var toolbar = this.quill.getModule("toolbar");
        // toolbar.addHandler("image", this.selectLocalImage.bind(this));

		// bind handlers to this instance
		this.handleDrop = this.handleDrop.bind(this);
		this.handlePaste = this.handlePaste.bind(this);
		// listen for drop and paste events
		this.quill.root.addEventListener('drop', this.handleDrop, false);
		this.quill.root.addEventListener('paste', this.handlePaste, false);
	}

	/**
	 * Handler for drop event to read dropped files from evt.dataTransfer
	 * @param {Event} evt
	 */
	handleDrop(evt) {
		evt.preventDefault();
		if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {

            console.log('handleDrop');
            
			if (document.caretRangeFromPoint) {
				const selection = document.getSelection();
				const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
				if (selection && range) {
					selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
				}
			}
			this.readFiles(evt.dataTransfer.files, this.insert.bind(this));
		}
	}

	/**
	 * Handler for paste event to read pasted files from evt.clipboardData
	 * @param {Event} evt
	 */
	handlePaste(evt) {
		if (evt.clipboardData && evt.clipboardData.items && evt.clipboardData.items.length) {
			this.readFiles(evt.clipboardData.items, dataUrl => {
				const selection = this.quill.getSelection();

                console.log('handlePaste');

				if (selection) {
					// we must be in a browser that supports pasting (like Firefox)
					// so it has already been placed into the editor
				} else {
					// otherwise we wait until after the paste when this.quill.getSelection()
					// will return a valid index
					setTimeout(() => this.insert(dataUrl), 0);
				}
			});
		}
	}

	/**
	 * Insert the image into the document at the current cursor position
	 * @param {String} dataUrl  The base64-encoded image URI
	 */
	insert(dataUrl) {

        console.log("insert");
        console.log(dataUrl);

        // handle file upload
        let id = makeid(24);
        let sid = getSiteId();

        // console.log(file);
        // let file = fileEl.files[0];
        // if(typeof(file) === "undefined") continue;

        let file = this.dataURLtoFile(dataUrl, id);
      
        // TODO add global sizes setting 
        let fd = new FormData();
        // let sizes = document.querySelector("body").dataset.sizes;
        let sizes = '1200|720|100';

        fd.append('id', id);
        fd.append('sid', sid);
        fd.append('pid', 0);
        fd.append('key', 'image');
        fd.append('sizes', sizes);
        // fd.append('field', file);
        fd.append('file', file);
        fd.append('slug', 'post-'+id);
        fd.append('token', getCookie('kenzap_token'));

        // clear input file so that its not updated again
        // file.value = '';
        // _this.state.ajaxQueue+=1;

        fetch("https://api-v1.kenzap.cloud/upload/",{
            body: fd,
            method: "post"
        })
        .then(response => response.json())
        .then(response => {

           //  _this.state.ajaxQueue -= 1;
            if(response.success){

                let img = CDN + '/S'+sid+'/post-'+id+'-720.jpeg';

                // dataUrl = 'https://cdn4.buysellads.net/uu/1/41334/1550855401-cc_light.png';
                const index = (this.quill.getSelection() || {}).index || this.quill.getLength();
                this.quill.insertEmbed(index, 'image', img, 'user');


                // let toast = new bootstrap.Toast(document.querySelector('.toast'));
                // document.querySelector('.toast .toast-body').innerHTML = __('Order updated');  
                // toast.show();

                // // hide UI loader
                // hideLoader();
            }
        });


	}
    
    dataURLtoFile(dataurl, filename) {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }

	/**
	 * Extract image URIs a list of files from evt.dataTransfer or evt.clipboardData
	 * @param {File[]} files  One or more File objects
	 * @param {Function} callback  A function to send each data URI to
	 */
	readFiles(files, callback) {

		// check each file for an image
		[].forEach.call(files, file => {
			if (!file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
				// file is not an image
				// Note that some file formats such as psd start with image/* but are not readable
				return;
			}
			// set up file reader
			const reader = new FileReader();
			reader.onload = (evt) => {

                console.log("readFiles");
                console.log(evt.target.result);
				callback(evt.target.result);
			};
			// read the clipboard item or file
			const blob = file.getAsFile ? file.getAsFile() : file;
			if (blob instanceof Blob) {
				reader.readAsDataURL(blob);
			}
		});
	}
}

// categories input tags
export const simpleTags = (element) => {

    if (!element) {
        throw new Error("DOM Element is undifined! Please choose HTML target element.")
    }

    let DOMParent = element
    let DOMList
    let DOMInput
    let dataAttribute
    let arrayOfList

    function DOMCreate() {
        let ul = document.createElement("ul")
        let input = document.createElement("input")

        input.setAttribute('placeholder', 'new entry');

        DOMParent.appendChild(ul)
        DOMParent.appendChild(input)

        // first child is <ul>
        DOMList = DOMParent.firstElementChild
        // last child is <input>
        DOMInput = DOMParent.lastElementChild
    }

    function DOMRender() {
        // clear the entire <li> inside <ul>
        DOMList.innerHTML = ""

        // render each <li> to <ul>
        arrayOfList.forEach((currentValue, index) => {

            if (currentValue) {

                let li = document.createElement("li")
                li.innerHTML = `${currentValue} <a>&times;</a>`
                li.querySelector("a").addEventListener("click", function () {
                    onDelete(index)
                })

                DOMList.appendChild(li)
            }
        })

        setAttribute()
    }

    function onKeyUp() {
        DOMInput.addEventListener("keyup", function (event) {
            let text = this.value.trim()

            // check if ',' or 'enter' key was press
            if (text.includes(",") || event.keyCode === 13) {
                // check if empty text when ',' is remove
                if (text.replace(",", "") !== "") {
                    // push to array and remove ','
                    arrayOfList.push(text.replace(",", ""))
                }
                // clear input
                this.value = ""
            }

            DOMRender()
        })
    }

    function onDelete(id) {
        arrayOfList = arrayOfList.filter(function (currentValue, index) {
            if (index === id) {
                return false
            }
            return currentValue
        })

        DOMRender()
    }

    function getAttribute() {
        dataAttribute = DOMParent.getAttribute("data-simple-tags")
        dataAttribute = dataAttribute.split(",")

        // store array of data attribute in arrayOfList
        arrayOfList = dataAttribute.map((currentValue) => {
            return currentValue.trim()
        })
    }

    function setAttribute() {
        DOMParent.setAttribute("data-simple-tags", arrayOfList.toString())
    }

    getAttribute()
    DOMCreate()
    DOMRender()
    onKeyUp()
}