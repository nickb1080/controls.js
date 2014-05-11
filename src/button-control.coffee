BaseControl = require "./base-control.coffee"

class ButtonControl extends BaseControl
  # buttons default to "submit" type, which is silly.
  constructor : ->
    super arguments
    @el.type = "button"
    @type = "button"

  value : -> false

module.exports = ButtonControl