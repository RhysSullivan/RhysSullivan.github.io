/*
CREDIT TO THESE SOURCES:
https://github.com/gopinav/Chrome-Extensions
https://github.com/einaregilsson/Redirector
*/

//<iframe width="450" height="212" src="https://www.youtube.com/embed/LZSft4THWVQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>

function embedVideo() {
		let html = ""; 
		let filter = $("#search-input").val()			
		var n = filter.search("v=");		
		if(n <= -1)
		{
			//https://youtu.be/X5CZxkYrrK8
			n = filter.search("tu.be")
			console.log(n)
			html = `<iframe width="450" height="212" src="https://www.youtube.com/embed/` 
			html += filter.substr(n+5);
			html += `" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`
		}
		else
		{		
			html = `<iframe width="450" height="212" src="https://www.youtube.com/embed/` 
			html += filter.substr(n+2);
			html += `" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`
		}
        $("div.row").append(html);
		console.log("hi")
}


function pageLoad() {
  el('#add-button').addEventListener('click', embedVideo);
}

pageLoad();
