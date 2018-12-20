/**
 * The main block script, and the 'beef' of this plugins
 */

// Import our stylesheets
import "./style.scss";
import "./editor.scss";

// Destructure all the used things out of the global block libraries
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { MediaUpload, InspectorControls, RichText, URLInput } = wp.editor;
const {
  Button,
  TextControl,
  PanelBody,
  PanelRow,
  CheckboxControl
} = wp.components;

/**
 * Register the block and export the registered block
 */
export default registerBlockType("pcn/pcn-section", {
  // Block unique id
  title: __("PCN Section", "pcn"), // Human read title of the block. __() is the same functions used to translate wp themes
  description: __(
    // Human read description
    "A background image with headline, text and a few buttons.",
    "pcn"
  ),
  // Category to put the block in the search tool
  category: "common",
  // Default wp dashicon used, accepts svg asswel
  icon: "align-center",
  // Search keywords
  keywords: [__("Card", "pcn"), __("buttons", "pcn"), __("image", "pcn")],
  // All the dynamic attributes we use on the block
  attributes: {
    // Url of the background image to use
    backgroundURL: {
      type: "string"
    },
    // Wp given id of the background image
    backgroundID: {
      type: "number"
    },
    // The header (h2) text.
    headline: {
      // Array because it can have newlines
      type: "array",
      // What to include in the array, the children of the h2 are for example spans or italic html tags
      source: "children",
      // H2's class
      selector: ".pcn-section__headline"
    },
    // Same as the header only not h2 but a paragraph
    content: {
      type: "array",
      source: "children",
      selector: ".pcn-section__text"
    },
    // The text of the button
    buttonText: {
      type: "string",
      // Set a default so the button doesn't start to small
      default: __("Edit me", "npc")
    },
    // The url to link to on button click
    buttonLink: {
      type: "url"
    },
    // If the block should have 2 buttons
    twoButtons: {
      type: "boolean",
      default: false
    },
    // If twobuttons is true, the user get's options to set another button text and url
    secondButtonText: {
      type: "string",
      default: __("Edit me", "npc")
    },
    secondButtonLink: {
      type: "url"
    },
    // If the block should have another background image covering the first
    twoOverlays: {
      type: "boolean",
      default: false
    },
    // The second background's id and url
    secondBackgroundID: {
      type: "number"
    },
    secondBackgroundURL: {
      type: "string"
    }
  },
  /**
   * editor functionality
   * props contains all our attributes and other variables we can use
   */
  edit: props => {
    /**
     * Destructure the needed things out of props. setAttributes is used to change our attributes
     * className is the default class we get assigned from wp
     */
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
        secondButtonLink
      }
    } = props;

    /**
     * The classes for the inner container,
     * switches between background image or semi-transparant black depending on if there is an overlay image set
     */
    const sectionInnerClasses =
      twoOverlays && secondBackgroundID
        ? "pcn-section__inner pcn-section__inner--has-background-image"
        : "pcn-section__inner";

    /**
     * The JSX / React to render in the editor
     */
    return (
      <div className={className}>
        {/** JSX can only have one parent element so we wrap everything in this div
         *
         * InspectorControls that are always rendered
         */}
        <InspectorControls>
          {/* Define a panel that you can collapse in the editor and give it a title */}
          <PanelBody title={__("Extending settings", "pcn")}>
            {/**
             * Checkbox that is in a PanelRow component, set's the 1 or 2 buttons setting
             * Heading is the heading of this panel
             * Help is small text under the input
             * checked accepts a boolean. giving it twoButtons makes the visuals line up with our attribute
             * When the checkbox state changes we set the attribute twoButtons to the state of the checkbox
             */}
            <PanelRow>
              <CheckboxControl
                heading={__("Settings", "pcn")}
                label={__("2 Buttons", "pcn")}
                help={__("Defaults to 1 button", "pcn")}
                checked={twoButtons}
                onChange={twoButtons => setAttributes({ twoButtons })}
              />
            </PanelRow>
            {/* Switch between 1 or 2 overlays / background images */}
            <PanelRow>
              <CheckboxControl
                label={__("2 overlays", "pcn")}
                help={__("Defaults to 1 overlay", "pcn")}
                checked={twoOverlays}
                onChange={twoOverlays => setAttributes({ twoOverlays })}
              />
            </PanelRow>
          </PanelBody>
          {/* Panel for the buttons that remove the background images */}
          <PanelBody title={__("Remove images", "pcn")}>
            {/* Only render when there is a background set, which means we can actually remove it */}
            {backgroundID && (
              <PanelRow>
                {/**
                 * Render a button that deletes the selected background
                 */}
                <Button
                  isDefault
                  className="button button-large line-up-icons"
                  onClick={() => {
                    setAttributes({
                      backgroundID: null,
                      backgroundURL: null
                    });
                  }}
                >
                  <span class="dashicons dashicons-trash red" />
                  <span>&nbsp; {__("Primary image", "pcn")}</span>
                </Button>
              </PanelRow>
            )}

            {/* Only render when there is a second background set, which means we can actually remove it */}
            {secondBackgroundID && (
              <PanelRow>
                {/**
                 * Render a button that deletes the selected overlay
                 */}
                <Button
                  isDefault
                  className="button button-large line-up-icons"
                  onClick={() => {
                    setAttributes({
                      secondBackgroundID: null,
                      secondBackgroundURL: null
                    });
                  }}
                >
                  <span class="dashicons dashicons-trash red" />
                  <span>&nbsp;{__("Secondairy image", "pcn")}</span>
                </Button>
              </PanelRow>
            )}
          </PanelBody>
          {/* Renders text fields for setting the button text and link */}
          <PanelBody title={__("Buttons", "pcn")}>
            {/* Simple text input, that keeps sync with our buttonText attribute */}
            <TextControl
              label={__("Button text", "pcn")}
              value={buttonText}
              onChange={buttonText => setAttributes({ buttonText })}
            />
            {/* Add a custom label without putting it on a component (URLInput does not support labels) */}
            <label class="components-base-control__label" for="buttonLink">
              Button link
            </label>
            {/** Renders a select html field with all the posts and pages to choose from,
             * onChange gives the selected page / post's URL */}
            <URLInput
              id="buttonLink"
              value={buttonLink}
              onChange={(buttonLink, post) => setAttributes({ buttonLink })}
            />
            {/* Only render the options for the second button when 2 buttons is actually checked */}
            {twoButtons && (
              <TextControl
                label={__("Second button text", "pcn")}
                value={secondButtonText}
                onChange={secondButtonText =>
                  setAttributes({ secondButtonText })
                }
              />
            )}
            {twoButtons && (
              <label
                class="components-base-control__label"
                for="secondButtonLink"
              >
                Second button link
              </label>
            )}
            {twoButtons && ( //Need this second check because we can't add the two textfields in one statement (Needs 1 parent element).
              <URLInput
                id="secondButtonLink"
                value={secondButtonLink}
                onChange={(secondButtonLink, post) =>
                  setAttributes({ secondButtonLink })
                }
              />
            )}
          </PanelBody>
        </InspectorControls>
        {!backgroundID && (
          /**
           * Renders a button to upload an image when there is no background image set
           * on selecting a background set it's attributes.
           * The render attribute is the markup of this uploading tag.
           * On clicking the rendered button we call open which opens the wp media uploader
           */
          <MediaUpload
            onSelect={background => {
              setAttributes({
                backgroundID: background.id,
                backgroundURL: background.url
              });
            }}
            type="image"
            value={backgroundID}
            render={({ open }) => (
              <div>
                <Button className={"button button-large"} onClick={open}>
                  <span class="dashicons dashicons-upload" />
                  {__(" Upload Background", "pcn")}
                </Button>
                <p>
                  &nbsp;
                  {__(
                    "Upload an image to be used as the background to continue.",
                    "pcn"
                  )}
                </p>
              </div>
            )}
          />
        )}

        {/* Only render when there isn't a second overlay and the checkbox for 2 overlays is checked */}
        {twoOverlays && !secondBackgroundID && (
          <MediaUpload
            onSelect={secondBackground => {
              setAttributes({
                secondBackgroundID: secondBackground.id,
                secondBackgroundURL: secondBackground.url
              });
            }}
            type="image"
            value={secondBackgroundID}
            render={({ open }) => (
              <Button className={"button button-large"} onClick={open}>
                <span class="dashicons dashicons-upload" />
                {__(" Upload Second Background", "pcn")}
              </Button>
            )}
          />
        )}
        {/* The main content that will be seen, only rendered when there is a background set already */}
        {backgroundID && (
          // Set the background of this div to the selected image
          <div
            className="pcn-section alignfull"
            style={{ backgroundImage: "url(" + backgroundURL + ")" }}
          >
            {/**
             * Section inner classes determines background image styling or semi-transparant black background
             * If two overlays option is checked and there is a second image set, render background image else the semi-transparant background kicks in
             */}
            <div
              className={sectionInnerClasses}
              style={
                twoOverlays && secondBackgroundID
                  ? { backgroundImage: "url(" + secondBackgroundURL + ")" }
                  : {}
              }
            >
              <div className="pcn-section__content">
                {/**
                 * Richtext can be specified to be any tag, here we say h2.
                 * Richtext is used so the text can be edited
                 */}
                <RichText
                  tagName="h2"
                  className="pcn-section__headline"
                  multiline="span"
                  placeholder={__("Edit me", "pcn")}
                  value={headline}
                  // Something in the editor fucks with the fontsize so hardcode it here, not done in the front-end so no worries
                  style={{ fontSize: "3em" }}
                  // On changing the text set the attribute headline to the new text
                  onChange={headline => setAttributes({ headline })}
                />
                <RichText
                  tagName="p"
                  className="pcn-section__text"
                  multiline="span"
                  value={content}
                  // Something in the editor fucks with the fontsize so hardcode it here, not done in the front-end so no worries
                  style={{ fontSize: "2em" }}
                  onChange={content => setAttributes({ content })}
                  placeholder={__("Edit me", "pcn")}
                />
                <div className="pcn-section__button-group">
                  <a
                    href={buttonLink}
                    // Makes this first button a primary button if there is another button, else it will be a secondary button
                    className={
                      twoButtons
                        ? "pcn-section__button button"
                        : "pcn-section__button pcn-section__button--secondary button"
                    }
                  >
                    {/** The text specified in the inspector controls */}
                    <span>{buttonText}</span>
                  </a>
                  {/* Only render a second button if it's selected in the inspector */}
                  {twoButtons && (
                    <a
                      href={secondButtonLink}
                      className="pcn-section__button pcn-section__button--secondary button ml"
                    >
                      <span>{secondButtonText}</span>
                    </a>
                  )}
                </div>
                {/* End of pcn-section__button-group */}
              </div>
              {/* End of pcn-section__content */}
            </div>
            {/* End of inner section */}
          </div> // End of .pcn-section
        )}
      </div> // End of className
    );
  },
  // The markup that is saved when we save to the database. This does not contain any dynamic items
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
        buttonText
      }
    } = props;

    //The classes for the inner container, switches between background image or semi-transparant black
    const sectionInnerClasses =
      twoOverlays && secondBackgroundID
        ? "pcn-section__inner pcn-section__inner--has-background-image"
        : "pcn-section__inner";

    return (
      <div className={className}>
        {/* Add the custom classes to the parent div */}
        {/* Only render if there is a background set */}
        {backgroundID && (
          <div
            className="pcn-section alignfull"
            style={{ backgroundImage: "url(" + backgroundURL + ")" }}
          >
            {/* Semi-transparant black background overlay if there is no second background set,
           if there is the overlay will not be rendered and the second image will be instead */}
            <div
              className={sectionInnerClasses}
              style={
                twoOverlays && secondBackgroundID
                  ? { backgroundImage: "url(" + secondBackgroundURL + ")" }
                  : {}
              }
            >
              <div className="pcn-section__content">
                <h2 className="pcn-section__headline">{headline}</h2>
                <p className="pcn-section__text">{content}</p>
                <div className="pcn-section__button-group">
                  {/* Makes this first button a primary button if there is another button, else it will be a secondary button */}
                  <a
                    href={buttonLink}
                    className={
                      twoButtons
                        ? "pcn-section__button button"
                        : "pcn-section__button pcn-section__button--secondary button"
                    }
                  >
                    {buttonText}
                  </a>
                  {twoButtons /* Only render a second button if it's selected in the inspector */ && (
                    <a
                      href={secondButtonLink}
                      className="pcn-section__button pcn-section__button--secondary button ml"
                    >
                      {secondButtonText}
                    </a>
                  )}
                </div>
                {/* End of pcn-section__button-group */}
              </div>
              {/* End .pcn-section__content */}
            </div>
            {/* End .pcn-section__inner */}
          </div> // End .pcn-section
        )}
      </div> // End className
    );
  }
});
