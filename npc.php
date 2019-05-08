<?php
/**
 * Plugin's bootstrap file to launch the plugin.
 *
 * @package     npc\npc
 * @author      Laytan Laats (@laytanl)
 * @license     GPL2+
 *
 * @wordpress-plugin
 * Plugin Name: NPC
 * Plugin URI:  https://github.com/laytan/full-width-text-and-button-overlay-cards
 * Description: A plugin for the gutenberg editor utilizing the new blocks to make a block that's full width with a
 * background, overlay, header, buttons and some text.
 * Version:     1.0
 * Author:      Laytan Laats
 * Author URI:  https://www.github.com/laytan
 * Text Domain: pcn
 * Domain Path: /languages
 * License:     GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

//Define a namespace so wordpress loads our plugin correctly
namespace npc\npc;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Gets this plugin's absolute directory path.
 *
 * @return string
 */
function _get_plugin_directory()
{
    return __DIR__;
}

/**
 * Gets this plugin's URL.
 *
 * @return string
 */
function _get_plugin_url()
{
    //Define as static because this will never change between calls
    static $plugin_url;

    //If the static variable has not been set this reqeuest, define $plugin_url
    if (empty($plugin_url)) {
        $plugin_url = plugins_url(null, __FILE__);
    }

    return $plugin_url;
}

// Include the file that enqueues our other files
include __DIR__ . '/lib/enqueue-scripts.php';
