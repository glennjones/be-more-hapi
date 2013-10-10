
window.onload = function(){
	//getJSON('../sitenames/?callback=displaySites')
    getJSON('../maps/?ownershiptype=individual&callback=displayIndividual');
    getJSON('../maps/?ownershiptype=group&callback=displayGrouped');
}


function displayIndividual( sites ){
    displaySites( getNamesList(sites), 'support-single', 'Maps - for individual profile ownership'); 
}


function displayGrouped( sites ){
    displaySites( getNamesList(sites), 'support-group', 'Maps - for group profile ownership');
}



function getNamesList( sites ){
    var names = [];
    var i = sites.length;
    var x = 0;
    while (x < i) {
        names.push(sites[x].name)
        x++;
    }
    return names;
}


function displaySites( sites, elementID, title ){
	var h1 = document.createElement('h1');
    h1.className="entry-title";
	h1.appendChild(document.createTextNode(sites.length +  ' ' + title))

	var ul1 = document.createElement('ul');
	var ul2 = document.createElement('ul');
    var ul3 = document.createElement('ul');
    ul1.setAttribute('class', 'services');
    ul2.setAttribute('class', 'services');
    ul3.setAttribute('class', 'services');

	var third = Math.round(sites.length / 3);

	for (var x = 0; x < sites.length; x++) {

        // lowercase replace spaces, dots and dashes
        sites[x] = sites[x].replace(/\s+/g,'').replace('.','').replace(/-/g,'').toLowerCase();
        var li = document.createElement('li');
        var span = document.createElement('span');
        span.setAttribute('class', 'sprite-icons-' + sites[x]);
        li.appendChild(span);
        li.appendChild(document.createTextNode(sites[x]))
        if(x < third){
        	ul1.appendChild(li);
        }else if(x < (2 * third)){
        	ul2.appendChild(li);
        }else{
            ul3.appendChild(li);   
        } 

    }
    var support = document.getElementById(elementID);
    support.appendChild(h1);

    support.appendChild(ul1);
    support.appendChild(ul2);
    support.appendChild(ul3);
    
    
}


function getJSON(url) {
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
/*    if (url.indexOf('?') > -1)
        url += '&';
    else
        url += '?';
    url += 'rand=' + Math.random();*/
    script.setAttribute("src", url);
    document.getElementsByTagName('head')[0].appendChild(script);
};


