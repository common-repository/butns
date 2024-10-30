/* Functions for the butnsplugin popup */

tinyMCEPopup.requireLangPack();

var butnsButtonCode = (function() {

     var getSpanElementsByClassName = function(className) {
	 var allElements = document.getElementsByTagName('span');
 	 var elements = new Array();
	 var pattern = new RegExp("(^|\\s)"+className+"(\\s|$)");
         for (var i=0; i<allElements.length; i++) {
	     if (pattern.test(allElements[i].className) ) {
                 elements.push(allElements[i]);
             }             
         }
         return elements;
     };

    return {
	links: [],
        linkToLabel: new Object,
        query: "",
        queryShort: "",
        code: "",
        action: "",
        editor: tinyMCEPopup.editor,

        init: function() {
            tinyMCEPopup.resizeToInnerSize();    

            var elm = butnsButtonCode.editor.selection.getNode();

            // Check whether we are updating an existing butns link, or an 
            // existing normal link
	    if (elm != null && elm.nodeName == "A") {                
                    
                if (elm.className == "butns") {
	            butnsButtonCode.action = "update_butns";
                } else {
	            butnsButtonCode.action = "upgrade_normal_link";                    
                }
            } else {
	        butnsButtonCode.action = "insert";                    
            }

            butnsButtonCode.query = butnsButtonCode.getQueryString();
            butnsButtonCode.queryShort = butnsButtonCode.editor.selection.getContent();

            var elementList = getSpanElementsByClassName("querytag");
            for (var i=0; i<elementList.length; i++) {
                elementList[i].innerHTML = butnsButtonCode.query;
            }

	    if (butnsButtonCode.action == "update_butns") {
                // alert("Updating butns link");
                butnsButtonCode.parseCodeToLinks(butnsButtonCode.editor.dom.getAttrib(elm, 'href'));
            } else if (butnsButtonCode.action == "upgrade_normal_link") {
                // alert("Updating link");
            } else {
                // alert("New butns link");                
            }
        },

        // getAction: function() {

        //     var elm = butnsButtonCode.editor.selection.getNode();

        //     if (butnsButtonCode.action!=undefined && butnsButtonCode.action != "") {
        //         return butnsButtonCode.action;
        //     } else {
        //         // Check whether we are updating an existing butns link, or an 
        //         // existing normal link
	//         if (elm != null && elm.nodeName == "A") {                
                    
        //             if (elm.className == "butns") {
	//                 butnsButtonCode.action = "update_butns";
        //             } else {
	//                 butnsButtonCode.action = "upgrade_normal_link";                    
        //             }
        //         } else {
	//             butnsButtonCode.action = "insert";                    
        //         }
        //     }
        // },

        insertAction: function() {
            tinyMCEPopup.close();
        },

        getQueryString: function() {
            var selectionContent = "";
            if (butnsButtonCode.action == "upgrade_normal_link") {
                selectionContent = ('<a href="' + butnsButtonCode.editor.selection.getNode().href + '">' + 
                                    butnsButtonCode.editor.selection.getContent() + '</a>');
            } else {
                selectionContent = butnsButtonCode.editor.selection.getContent();                
            }
            return selectionContent;
        },

        // constructLinkLabelString: function(link,label) {
        //     if (label)
        //         return link + "{label:="+label+"}";
        //     else
        //         return link;                
        // },

        updateCode: function() {

            // Don't count strictly modifier links, since
            // they don't show up in the non-javascript version anyway
            var linkCounter = butnsButtonCode.links.length;
            var linkStr = "";
	    for (var j = 0; j < butnsButtonCode.links.length; j++) {
                var linkValue = butnsButtonCode.links[j];
                if (j!==0)
                    linkStr += ",";
                linkStr += linkValue;
                if (butnsButtonCode.linkToLabel[linkValue] != undefined) {
                    linkStr += "{label:="+butnsButtonCode.linkToLabel[linkValue]+"}";
                }
                if (unescape(butnsButtonCode.links[j])[0] == "{") {
                    linkCounter-=1;
                }
            }

            var style = "page";
            var queryComplete = escape(butnsButtonCode.query);
            var queryShortHtml = butnsButtonCode.queryShort;

            butnsButtonCode.code = '<a class="butns" href="http://test.butns.com?q=' + queryComplete + '&amp;l=' + escape(linkStr) + '&amp;d=' + style + '">' + queryShortHtml + '<script type="text/javascript" language="javascript" src="http://test.butns.com/butns.js"></script><iframe style="height:12px;width:'+ (linkCounter*(8+2)+2+1) +'px" scrolling="no" frameborder="0" src="http://test.butns.com/noscript.php?q=' + queryComplete + '&amp;l=' + escape(linkStr) + '"></iframe></span></a>';

            var preview = document.getElementById("butnspreview");
            if (butnsButtonCode.code!=="")
                preview.innerHTML = butnsButtonCode.code;
            else
                preview.innerHTML = butnsButtonCode.getQueryString();            
            butns.findTags();
        },

        getUrlQuery: function(url, key) {
            key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
            var qs = regex.exec(url);
            if (qs==null) {
                return "";
            } else {
                return qs[1];
            }
        },

        parseLinkString: function(link) {
            var label = "";
            var icon = "";
            if (link[link.length-1] == '}') {
                 var pos = link.lastIndexOf('{');
                 if (pos != -1) {
                     var modifiers = link.substr(pos+1, link.length-pos-2);
                     var modifierList = modifiers.split(',');
	             for (var i = 0; i < modifierList.length; i++) {
                         var modifierPair = modifierList[i].split(":=");
                         var modifier = modifierPair[0];
                         var modifierValue = modifierPair[1];

                         if (modifier == "label") {
                             label = modifierValue;
                         } else if (modifier == "icon") {
                             icon = modifierValue;
                         }
                     }
                     link = link.substr(0,pos);
                 }
            }
            return {link:link, label:label, icon:icon};
        },

        parseCodeToLinks: function(url) {
            var links = butnsButtonCode.getUrlQuery(url, "l").split(escape(","));
	    for (var i = 0; i < links.length; i++) {
                butnsButtonCode.addLink(links[i]);
            }
        },

        addLink: function(linkString) {
            
            var splitLink = butnsButtonCode.parseLinkString(unescape(linkString));
            var linkValue = splitLink.link;
            var linkLabel = splitLink.label;

            if (linkValue.slice(0,3) == "www") {
                linkValue = "http://"+linkValue;
            }

            if (linkLabel !== "") {
                butnsButtonCode.linkToLabel[linkValue] = linkLabel;
            }

            // var label = document.getElementById("label");
            var linkTable = document.getElementById("linktable");
            // alert("Adding link: " + link.value + " " + label.value);

            var newTableRow = document.createElement('tr');

            var newCheckBoxElement = document.createElement('td');
            var newCheckBox = document.createElement('input');
            newCheckBox.type = 'checkbox';
            newCheckBox.checked = true;
            newCheckBox.className = "linkitemcheckbox";
            newCheckBoxElement.onclick = function(){
                var index = butnsButtonCode.links.indexOf(linkValue);
                if (index!==-1) {
                    butnsButtonCode.links.splice(index,1);
                } else {
                    butnsButtonCode.links.push(linkValue);
                }
                butnsButtonCode.updateCode();
            };
            newCheckBoxElement.appendChild(newCheckBox);

            var newLinkElement = document.createElement('td');
            var newLink = document.createElement('input');
            newLink.type = 'text';
            newLink.value = linkValue;
            newLink.style.width = "100%";
            newLinkElement.className = "linkitemleft";
            newLinkElement.appendChild(newLink);

            var newLabelElement = document.createElement('td');
            var newLabel = document.createElement('input');
            newLabel.type = 'text';
            newLabel.value = linkLabel;
            newLabel.style.width = "100%";
            newLabel.onchange = function() {
                butnsButtonCode.linkToLabel[linkValue] = this.value;
                butnsButtonCode.updateCode();
            };
            newLabelElement.className = "linkitemright";
            newLabelElement.appendChild(newLabel);

            newTableRow.appendChild(newCheckBoxElement);
            newTableRow.appendChild(newLinkElement);
            newTableRow.appendChild(newLabelElement);

            linkTable.appendChild(newTableRow);    

            // butnsButtonCode.links.push(butnsButtonCode.constructLinkLabelString(link.value));
            butnsButtonCode.links.push(linkValue);
            // alert(butnsButtonCode.links);

            butnsButtonCode.updateCode();            
        },

        addLinkFromElement: function(id) {
            var linkElement = document.getElementById(id);
            var link = linkElement.value;
	    if (link !== "") {
	        butnsButtonCode.addLink(link);
            }
            linkElement.value = "";
	    setTimeout(function(){linkElement.focus();}, 50);
        },

        // checkboxAction: function(element) {
        //     alert(element);  
        // },

        insertAction: function() {
            butnsButtonCode.editor.execCommand("mceInsertRawHTML", false, butnsButtonCode.code);
	    tinyMCEPopup.close();
        }
        
    };
})();

// function init() {
//     tinyMCEPopup.resizeToInnerSize();    
// }

// function insertAction() {
//     tinyMCEPopup.close();
// }

// function getQueryString() {
//     var editor = tinyMCEPopup.editor;
//     var selectionContent = editor.selection.getContent();
//     // var selectionParentElement = editor.dom.getParent(editor.selection.getNode(), "A");
    
//     // if (selectionParentElement != null) {
//     //     if (selectionParentElement.nodeName == "A") {
//     //         return editor.dom.getAttrib(selectionParentElement, 'href');
//     //     } else {
//     return selectionContent;
//     //     }
//     // }
// }

// function addLink(id) {
//     var link = document.getElementById(id);
//     // var label = document.getElementById("label");
//     var linkTable = document.getElementById("linktable");
//     // alert("Adding link: " + link.value + " " + label.value);

//     var newTableRow = document.createElement('tr');

//     var newCheckBoxElement = document.createElement('td');
//     var newCheckBox = document.createElement('input');
//     newCheckBox.type = 'checkbox';
//     newCheckBox.checked = true;
//     newCheckBox.className = "linkitemcheckbox";
//     newCheckBoxElement.appendChild(newCheckBox);

//     var newLinkElement = document.createElement('td');
//     var newLink = document.createElement('input');
//     newLink.type = 'text';
//     newLink.value = link.value;
//     newLink.style.width = "100%";
//     newLinkElement.className = "linkitemleft";
//     newLinkElement.appendChild(newLink);

//     var newLabelElement = document.createElement('td');
//     var newLabel = document.createElement('input');
//     newLabel.type = 'text';
//     newLabel.value = "";
//     newLabel.style.width = "100%";
//     newLabelElement.className = "linkitemright";
//     newLabelElement.appendChild(newLabel);

//     newTableRow.appendChild(newCheckBoxElement);
//     newTableRow.appendChild(newLinkElement);
//     newTableRow.appendChild(newLabelElement);

//     linkTable.appendChild(newTableRow);    
// }

// Initialize
tinyMCEPopup.onInit.add(butnsButtonCode.init);

