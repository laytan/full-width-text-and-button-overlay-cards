/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
    registerBlockType,
} = wp.blocks;
const {
    MediaUpload,
    InspectorControls,
    RichText,    
    URLInput,
} = wp.editor;
const {
    Button,
    TextControl,
    PanelBody,
    PanelRow,
    CheckboxControl,
} = wp.components;

/**
 * Register block
 */
export default registerBlockType(
  'pcn/pcn-section', {
    title: __('PCN Section', 'pcn'),
    description: __('A background image with headline, text and a few buttons.', 'pcn'),
    category: 'common',
    icon: 'align-center',
    keywords: [
      __('Card', 'pcn'),
      __('buttons', 'pcn'),
      __('image', 'pcn'),
    ],
    attributes: {
      backgroundURL: {
        type: 'string',
      },
      backgroundID: {
        type: 'number',
      },
      headline: {
        type: 'array',
        source: 'children',
        selector: '.pcn-section__headline',
      },
      content: {
        type: 'array',
        source: 'children',
        selector: '.pcn-section__text',
      },
      buttonText: {
        type: 'string',
        default: __('Edit me', 'npc'),
      },
      buttonLink: {
        type: 'url',
      },
      twoButtons: {
        type: 'boolean',
        default: false,
      },
      secondButtonText: {
        type: 'string',
        default: __('Edit me', 'npc'),
      },
      secondButtonLink: {
        type: 'url',
      },
      twoOverlays: {
        type: 'boolean',
        default: false,
      },
      secondBackgroundID: {
        type: 'number',
      },
      secondBackgroundURL: {
        type: 'string',
      },
      url: {
        type: 'url',
      },
    },
    edit: props => {
      const {
        className,
        setAttributes,
        attributes: { 
          twoButtons, 
          twoOverlays, 
          secondBackgroundID, 
          secondBackgroundURL, 
          backgroundID, 
          backgroundURL, 
          content, 
          headline, 
          buttonText,
          buttonLink,
          secondButtonText,
          secondButtonLink,
          url,
        },
      } = props;

      //The classes for the inner container, switches between background image or semi-transparant black
      const sectionInnerClasses = twoOverlays && secondBackgroundID ? 
        'pcn-section__inner pcn-section__inner--has-background-image' : 
        'pcn-section__inner';

      //Update the attributes when a new image is selected as the background
      const onSelectBackground = background => {
        setAttributes( {
          backgroundID: background.id,
          backgroundURL: background.url,
        } );
      };

      //Reset the attributes belonging to the background when the remove button is clicked
      const onRemoveBackground = () => {
        setAttributes({
          backgroundID: null,
          backgroundURL: null,
        } );
      };

      //Update the attributes when a new image is selected as the second background
      const onSelectSecondBackground = secondBackground => {
        setAttributes( {
          secondBackgroundID: secondBackground.id,
          secondBackgroundURL: secondBackground.url,
        } );
      };

      //Reset the attributes belonging to the second background when the remove button is clicked
      const onRemoveSecondBackground = () => {
        setAttributes({
          secondBackgroundID: null,
          secondBackgroundURL: null,
        } );
      };

      return ( 
        <div className={ className }>
          { /* InspectorControls that are always rendered */ }
          <InspectorControls>
            <PanelBody
            title={ __('Extending settings', 'pcn') }
            >
            { /* Switch between 1 or 2 buttons */ }
              <PanelRow>
                <CheckboxControl 
                  heading={ __('Settings', 'pcn') }
                  label={ __('2 Buttons', 'pcn') }
                  help={ __('Defaults to 1 button', 'pcn') }
                  checked={ twoButtons }
                  onChange={ twoButtons => setAttributes( { twoButtons } ) }
                />
              </PanelRow>
              { /* Switch between 1 or 2 overlays / background images */ }
              <PanelRow>
                <CheckboxControl
                  label={ __('2 overlays', 'pcn') }
                  help={ __('Defaults to 1 overlay', 'pcn') }
                  checked={ twoOverlays }
                  onChange={ twoOverlays => setAttributes( { twoOverlays } ) }
                />
              </PanelRow>
            </PanelBody>
            { /* Panel for the buttons that remove the overlays */ }
            <PanelBody
            title={ __('Remove images', 'pcn') }
            >
            { /* Only render when there is a background set, which means we can actually remove it */ }
              { backgroundID &&
                <PanelRow>
                  <Button
                      isDefault
                      className="button button-large line-up-icons"
                      onClick={ onRemoveBackground }
                    >
                      <span class="dashicons dashicons-trash red"></span>
                      <span>&nbsp; { __('Primary image', 'pcn') }</span>                
                    </Button>
                  </PanelRow>
              }

              { /* Only render when there is a second background set, which means we can actually remove it */ }
              { secondBackgroundID &&
                <PanelRow>
                  <Button
                    isDefault
                    className="button button-large line-up-icons"
                    onClick={ onRemoveSecondBackground }
                  >
                    <span class="dashicons dashicons-trash red"></span>                
                    <span>&nbsp;{ __('Secondairy image', 'pcn') }</span>
                  </Button>
                </PanelRow>
              }
            </PanelBody>
            { /* Renders text fields for setting the button text and link */ }
            <PanelBody
             title={ __('Buttons', 'pcn') }>
              <TextControl
                  label={ __('Button text', 'pcn') }
                  value={ buttonText }
                  onChange={ ( buttonText ) => setAttributes( { buttonText } ) }
                />
               <label class="components-base-control__label" for="buttonLink">Button link</label>
                <URLInput
                  id="buttonLink"
                  value={ buttonLink }
                  onChange={ (buttonLink, post) => setAttributes( { buttonLink } ) } 
                />
              { /* Only render the options for the second button when 2 buttons is actually checked */ }
              { twoButtons &&
                <TextControl
                  label={ __('Second button text', 'pcn') }
                  value={ secondButtonText }
                  onChange={ ( secondButtonText ) => setAttributes( { secondButtonText } ) }
                />
              }
              { twoButtons &&
                <label class="components-base-control__label" for="secondButtonLink">Second button link</label>
              }
              { twoButtons && //Need this second check because we can't add the two textfields in one statement (Needs 1 parent element).
                <URLInput
                  id="secondButtonLink"
                  value={ secondButtonLink }
                  onChange={ (secondButtonLink, post) => setAttributes( { secondButtonLink } ) } 
                />
              }
            </PanelBody>
          </InspectorControls>
          { /* Renders a button to upload an image when there is no background image set */ }
          { ! backgroundID &&
            <MediaUpload
            onSelect={ onSelectBackground }
            type="image"
            value={ backgroundID }
            render={ ( { open } ) => (
              <div>
                <Button
                className={ "button button-large" }
                onClick={ open }
                >
                  <span class="dashicons dashicons-upload"></span>
                  { __( ' Upload Background', 'pcn' ) }
                </Button>
                <p>&nbsp; { __('Upload an image to be used as the background to continue.', 'pcn') } </p>
              </div>
            ) }
            >
            </MediaUpload>
          }

          { /* Only render when there isn't a second overlay and the checkbox for 2 overlays is checked */ }
          { twoOverlays && ! secondBackgroundID &&
            <MediaUpload
            onSelect={ onSelectSecondBackground }
            type="image"
            value={ secondBackgroundID }
            render={ ( { open } ) => (
              <Button
                className={ "button button-large" }
                onClick={ open }
              >
                <span class="dashicons dashicons-upload"></span>
                { __( ' Upload Second Background', 'pcn' ) }
              </Button>
            ) }
            >
            </MediaUpload>
          }
          { /* The main content that will be seen, only rendered when there is a background set already */ }
          { backgroundID &&
            <div 
            className="pcn-section alignfull" 
            style={ { backgroundImage: 'url(' + backgroundURL + ')', } }
            >
              { /* Section inner classes determines background image styling or semi-transparant black background
                   If two overlays option is checked and there is a second image set, render background image else the semi-transparant background kicks in  
              */ }
              <div 
              className={ sectionInnerClasses } 
              style={ twoOverlays && secondBackgroundID ? { backgroundImage: 'url(' + secondBackgroundURL + ')', } : {} }
              >
                <div 
                className="pcn-section__content"
                >
                  <RichText
                    tagName="h2"
                    className="pcn-section__headline"
                    multiline="span"
                    placeholder={ __('Edit me', 'pcn') }
                    value={ headline }
                    style={ { fontSize: "3em", } } // Something in the editor fucks with the fontsize so hardcode it here, not done in the front-end so no worries
                    onChange={ headline => setAttributes( { headline } ) }
                  />
                  <RichText
                    tagName="p"
                    className="pcn-section__text"
                    multiline="span"
                    value={ content }
                    style={ { fontSize: "2em", } } // Something in the editor fucks with the fontsize so hardcode it here, not done in the front-end so no worries
                    onChange={ content => setAttributes( { content } ) }
                    placeholder={ __('Edit me', 'pcn') }
                  />
                  <div className="pcn-section__button-group">
                  { /* Makes this first button a primary button if there is another button, else it will be a secondary button */ }
                  <a href={ buttonLink } className={ twoButtons ? "pcn-section__button button" : "pcn-section__button pcn-section__button--secondary button" }>
                      <span>{ buttonText }</span>
                  </a>
                  { /* Only render a second button if it's selected in the inspector */ }
                  { twoButtons &&
                    <a href={ secondButtonLink } className="pcn-section__button pcn-section__button--secondary button ml">
                      <span>{ secondButtonText }</span>
                    </a>
                  } 
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      );
    },
    save: props => {
      const {
        className,
        attributes: { 
          backgroundID, 
          twoOverlays, 
          secondBackgroundID, 
          secondBackgroundURL, 
          secondButtonText, 
          secondButtonLink,
          buttonLink, 
          twoButtons, 
          backgroundURL, 
          content, 
          headline, 
          buttonText, 
        },
      } = props;

      //The classes for the inner container, switches between background image or semi-transparant black
      const sectionInnerClasses = twoOverlays && secondBackgroundID ? 
        'pcn-section__inner pcn-section__inner--has-background-image' : 
        'pcn-section__inner';

      return (
        <div className={ className }> { /* Add the custom classes to the parent div */ }
        { /* Only render if there is a background set */ }
          { backgroundID && 
          <div 
          className="pcn-section alignfull" 
          style={ { backgroundImage: 'url(' + backgroundURL + ')', } }
          >
          { /* Semi-transparant black background overlay if there is no second background set,
           if there is the overlay will not be rendered and the second image will be instead */ }
            <div 
            className={ sectionInnerClasses } 
            style={ twoOverlays && secondBackgroundID ? { backgroundImage: 'url(' + secondBackgroundURL + ')', } : {} }
            >
              <div className="pcn-section__content">
                <h2
                  className="pcn-section__headline"
                >
                  { headline }
                </h2>
                <p
                  className="pcn-section__text"
                >
                  { content }
                </p>
                <div className="pcn-section__button-group">
                { /* Makes this first button a primary button if there is another button, else it will be a secondary button */ }
                  <a href={ buttonLink } className={ twoButtons ? "pcn-section__button button" : "pcn-section__button pcn-section__button--secondary button" }>
                      { buttonText }
                  </a>
                  { twoButtons &&  /* Only render a second button if it's selected in the inspector */
                    <a href={ secondButtonLink } className="pcn-section__button pcn-section__button--secondary button ml">
                      { secondButtonText }
                    </a>
                  } 
                </div>
              </div>
            </div>
          </div>
          }
        </div> 
      );
    },
  },
);