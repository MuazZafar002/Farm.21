
const {
  createRunOncePlugin,
  withAndroidStyles,
  AndroidConfig,
} = require('@expo/config-plugins')

function setForceDarkModeToFalse(styles: any) {
  styles = AndroidConfig.Styles.assignStylesValue(styles, {
    add: true,
    parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
    name: `android:forceDarkAllowed`,
    value: 'false',
  })

  return styles
}

const withDisableForcedDarkModeAndroid = (config: any) => {
  return withAndroidStyles(config, (config: any) => {
    config.modResults = setForceDarkModeToFalse(config.modResults)
    return config
  });
}

module.exports = createRunOncePlugin(
  withDisableForcedDarkModeAndroid,
  'disable-forced-dark-mode',
  '1.0.0'
)
