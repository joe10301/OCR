$( document ).ready(function() {

const defaultBtn=  document.getElementById("default-btn");
		const customBtn=  document.getElementById("custom-btn");
		customBtn.addEventListener("click",()=>{
			defaultBtn.click();
		})

defaultBtn.addEventListener("change",function(e){

	const image_div=document.querySelector(".image");
	if(image_div.childNodes.length>0){
		console.log(image_div.childNodes);
		image_div.removeChild(image_div.childNodes[0]);
		
	}
	// document.querySelector(".content").removeClass(".icon");
	// document.querySelector(".content").removeClass(".text");
	const file =e.target.files[0];
	if(file){
	let reader = new FileReader();
	reader.onload= function(){
		const result = reader.result;
		var image = new Image();
		image.src = result;
		image_div.appendChild(image);
		document.querySelector(".wrapper").style.border="none";
	}
	reader.readAsDataURL(file);
	startRecognize(file);
}
if(this.value){
	let valueStore = this.value;
	document.querySelector(".file-name").innerHTML = e.target.value.split( '\\' ).pop();;
}
	
})
// var inputs = document.querySelectorAll( '.inputfile' );
// Array.prototype.forEach.call( inputs, function( input )
// {
// 	var label	 = input.nextElementSibling,
// 		labelVal = label.innerHTML;
// 	input.addEventListener( 'change', function( e )
// 	{
// 		var fileName = '';
// 		if( this.files && this.files.length > 1 )
// 			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
// 		else
// 			fileName = e.target.value.split( '\\' ).pop();

// 		if( fileName ){
// 			label.querySelector( 'span' ).innerHTML = fileName;

// 			let reader = new FileReader();
// 			reader.onload = function () {
// 				let dataURL = reader.result;
// 				$("#selected-image").attr("src", dataURL);
// 				$("#selected-image").addClass("col-12");
// 			}
// 			let file = this.files[0];
// 			reader.readAsDataURL(file);
// 			startRecognize(file);
// 		}
// 		else{
// 			label.innerHTML = labelVal;
// 			$("#selected-image").attr("src", '');
// 			$("#selected-image").removeClass("col-12");
// 			$("#arrow-right").addClass("fa-arrow-right");
// 			$("#arrow-right").removeClass("fa-check");
// 			$("#arrow-right").removeClass("fa-spinner fa-spin");
// 			$("#arrow-down").addClass("fa-arrow-down");
// 			$("#arrow-down").removeClass("fa-check");
// 			$("#arrow-down").removeClass("fa-spinner fa-spin");
// 			$("#log").empty();
// 		}
// 	});
	
	// Firefox bug fix
// 	input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
// 	input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
// });
});

function startRecognize(img){
$("#arrow-right").removeClass("fa-arrow-right");
$("#arrow-right").addClass("fa-spinner fa-spin");
$("#arrow-down").removeClass("fa-arrow-down");
$("#arrow-down").addClass("fa-spinner fa-spin");
recognizeFile(img);
}

function progressUpdate(packet){
var log = document.getElementById('log');

if(log.firstChild && log.firstChild.status === packet.status){
	if('progress' in packet){
		var progress = log.firstChild.querySelector('progress')
		progress.value = packet.progress
	}
}else{
	var line = document.createElement('div');
	line.status = packet.status;
	var status = document.createElement('div')
	status.className = 'status'
	status.appendChild(document.createTextNode(packet.status))
	line.appendChild(status)

	if('progress' in packet){
		var progress = document.createElement('progress')
		progress.value = packet.progress
		progress.max = 1
		line.appendChild(progress)
	}


	if(packet.status == 'done'){
		log.innerHTML = ''
		var pre = document.createElement('pre')
		pre.setAttribute('id','text-area');
		pre.style.fontFamily="auto";
		pre.style.fontWeight="bold";
		pre.appendChild(document.createTextNode(packet.data.text.replace(/\n\s*\n/g, '\n')))
		line.innerHTML = ''
		line.appendChild(pre)
		$(".fas").removeClass('fa-spinner fa-spin')
		$(".fas").addClass('fa-check')
		var download = document.querySelector(".download-btn");
		
		download.addEventListener("click", function(){
			var textArea = document.getElementById("text-area").innerHTML;
			var fileName = "output.txt";
			download(fileName, textArea);

			function download(filename, text) {
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				element.setAttribute('download', filename);
			  
				element.style.display = 'none';
				document.body.appendChild(element);
			  
				element.click();
			  
				document.body.removeChild(element);
			  }
			
		})
	}

	log.insertBefore(line, log.firstChild)
}
}

function recognizeFile(file){
$("#log").empty();
const corePath = window.navigator.userAgent.indexOf("Edge") > -1
? 'js/tesseract-core.asm.js'
: 'js/tesseract-core.wasm.js';


const worker = new Tesseract.TesseractWorker({
	corePath,
});

worker.recognize(file,
	$("#langsel").val()
)
	.progress(function(packet){
		console.info(packet)
		progressUpdate(packet)

	})
	.then(function(data){
		console.log(data)
		progressUpdate({ status: 'done', data: data })
	})
}

