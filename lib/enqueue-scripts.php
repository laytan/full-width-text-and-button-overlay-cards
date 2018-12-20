<?php

namespace npc\npc;

/**
 * Hook into the enqueue_block_editor assets hook. 
 * Get's called on loading of the editor scripts.
 */
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_assets' );
/**
 * Enqueue block editor only JavaScript and CSS.
 */
function enqueue_block_editor_assets() {
	// The locations of our editor scripts
	$block_path = '/assets/js/editor.blocks.js';
	$style_path = '/assets/css/blocks.editor.css';
	/**
	 * Enqueue the bundled block JS file,
	 * depending on the global block api's to be loaded first, 
	 * the JS file is only needed in the editor
	 */
	wp_enqueue_script(
		'npc-block-js',
		_get_plugin_url() . $block_path,
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ],
		filemtime( _get_plugin_directory() . $block_path )
	);

	// Enqueue styles that are only used in the editor, depending on wp-edit-blocks to be loaded first
	wp_enqueue_style(
		'npc-block-editor-css',
		_get_plugin_url() . $style_path,
		array('wp-edit-blocks'),
		filemtime( _get_plugin_directory() . $style_path )
	);
}

/**
 * Hook into the enqueue_block_assets hook.
 * Get's called on the front-end and back-end (editor)
 */
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_assets' );
/**
 * Enqueue front end and editor JavaScript and CSS assets.
 */
function enqueue_assets() {
	//Front and back-end stylesheet location
	$style_path = '/assets/css/blocks.style.css';
	wp_enqueue_style(
		'npc-block-css',
		_get_plugin_url() . $style_path,
		array('wp-edit-blocks'),
		filemtime( _get_plugin_directory() . $style_path )
	);
}