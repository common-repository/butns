(function() {

	tinymce.create('tinymce.plugins.ButnsPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {

			// Register the command so that it can be invoked by 
                        // using tinyMCE.activeEditor.execCommand('mceButns');
			ed.addCommand('mceButns', function() {

                                var sel=ed.selection;
                                if(sel.isCollapsed() && !ed.dom.getParent(sel.getNode(),"A")) {
                                    return
                                }
				ed.windowManager.open({
					file : url + '/link.html',
					width : 500 + ed.getLang('butnsbutton.delta_width', 0),
					height : 275 + ed.getLang('butnsbutton.delta_height', 0),
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
				});
			});

			// Register butns button
			ed.addButton('butnsbutton', {
				title : 'Add Butns link',
				cmd : 'mceButns',
				image : url + '/img/20x20_butns_logo.gif'
			});

			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n, e) {
                           cm.setDisabled("butnsbutton", e && n.nodeName != "A");
                           cm.setActive("butnsbutton", n.nodeName == "A" && !n.name)
			});

		},

		/**
		 * Creates control instances based in the incoming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Butns plugin',
				author : 'Wouter Boomsma',
				authorurl : 'http://www.butns.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/butns',
				version : "0.2"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('butnsbutton', tinymce.plugins.ButnsPlugin);
})();
