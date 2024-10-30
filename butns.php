<?php
/*
Plugin Name: Butns
Plugin URI: http://www.butns.com/plugins.html
Description: Butns enables you to add more destinations to each hyperlink on your website, allowing your users to choose exactly where to go for more information. This plugin makes it possible to add butns links directly from TinyMCE, the visual editor in WordPress.
Version: 0.2
Author: The Butns Team
Author URI: http://www.butns.com/

License:

    Copyright 2010 Butns (email : hello@butns.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

function butns_plugin_addbutton() {

   // Don't bother doing this stuff if the current user lacks permissions
   if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
     return;
 
   // Add only in Rich Editor mode
   if ( get_user_option('rich_editing') == 'true') {
     add_filter("mce_external_plugins", "add_butns_tinymce_plugin");
     add_filter('mce_buttons', 'register_butns_button');
   }
}
 
function register_butns_button($buttons) {
   array_push($buttons, "separator", "butnsbutton");
   return $buttons;
}
 
// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
function add_butns_tinymce_plugin($plugin_array) {
   $plugin_array['butnsbutton'] = WP_PLUGIN_URL.'/butns/tinymce/editor_plugin.js';
   return $plugin_array;
}
 
// init process for button control
add_action('init', 'butns_plugin_addbutton');

?>
