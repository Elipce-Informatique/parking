/*!
 * Bootstrap v3.3.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
    }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert   = function (el) {
        $(el).on('click', dismiss, this.close)
    }

    Alert.VERSION = '3.3.0'

    Alert.TRANSITION_DURATION = 150

    Alert.prototype.close = function (e) {
        var $this    = $(this)
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = $(selector)

        if (e) e.preventDefault()

        if (!$parent.length) {
            $parent = $this.closest('.alert')
        }

        $parent.trigger(e = $.Event('close.bs.alert'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger('closed.bs.alert').remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent
                .one('bsTransitionEnd', removeElement)
                .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
            removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.alert')

            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.alert

    $.fn.alert             = Plugin
    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
        this.$element  = $(element)
        this.options   = $.extend({}, Button.DEFAULTS, options)
        this.isLoading = false
    }

    Button.VERSION  = '3.3.0'

    Button.DEFAULTS = {
        loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
        var d    = 'disabled'
        var $el  = this.$element
        var val  = $el.is('input') ? 'val' : 'html'
        var data = $el.data()

        state = state + 'Text'

        if (data.resetText == null) $el.data('resetText', $el[val]())

        // push to event loop to allow forms to submit
        setTimeout($.proxy(function () {
            $el[val](data[state] == null ? this.options[state] : data[state])

            if (state == 'loadingText') {
                this.isLoading = true
                $el.addClass(d).attr(d, d)
            } else if (this.isLoading) {
                this.isLoading = false
                $el.removeClass(d).removeAttr(d)
            }
        }, this), 0)
    }

    Button.prototype.toggle = function () {
        var changed = true
        var $parent = this.$element.closest('[data-toggle="buttons"]')

        if ($parent.length) {
            var $input = this.$element.find('input')
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
                else $parent.find('.active').removeClass('active')
            }
            if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
        } else {
            this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
        }

        if (changed) this.$element.toggleClass('active')
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.button')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.button', (data = new Button(this, options)))

            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }

    var old = $.fn.button

    $.fn.button             = Plugin
    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
    }


    // BUTTON DATA-API
    // ===============

    $(document)
        .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
            var $btn = $(e.target)
            if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
            Plugin.call($btn, 'toggle')
            e.preventDefault()
        })
        .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
            $(e.target).closest('.btn').toggleClass('focus', e.type == 'focus')
        })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element    = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options     = options
        this.paused      =
            this.sliding     =
                this.interval    =
                    this.$active     =
                        this.$items      = null

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
            .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }

    Carousel.VERSION  = '3.3.0'

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }

    Carousel.prototype.keydown = function (e) {
        switch (e.which) {
            case 37: this.prev(); break
            case 39: this.next(); break
            default: return
        }

        e.preventDefault()
    }

    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
    }

    Carousel.prototype.getItemForDirection = function (direction, active) {
        var delta = direction == 'prev' ? -1 : 1
        var activeIndex = this.getItemIndex(active)
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function (pos) {
        var that        = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find('.item.active')
        var $next     = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var fallback  = type == 'next' ? 'first' : 'last'
        var that      = this

        if (!$next.length) {
            if (!this.options.wrap) return
            $next = this.$element.find('.item')[fallback]()
        }

        if ($next.hasClass('active')) return (this.sliding = false)

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one('bsTransitionEnd', function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger(slidEvent)
        }

        isCycling && this.cycle()

        return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action  = typeof option == 'string' ? option : options.slide

            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }

    var old = $.fn.carousel

    $.fn.carousel             = Plugin
    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
    }


    // CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
        var href
        var $this   = $(this)
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        Plugin.call($target, options)

        if (slideIndex) {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    }

    $(document)
        .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            Plugin.call($carousel, $carousel.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element      = $(element)
        this.options       = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
        this.transitioning = null

        if (this.options.parent) {
            this.$parent = this.getParent()
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }

        if (this.options.toggle) this.toggle()
    }

    Collapse.VERSION  = '3.3.0'

    Collapse.TRANSITION_DURATION = 350

    Collapse.DEFAULTS = {
        toggle: true,
        trigger: '[data-toggle="collapse"]'
    }

    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return

        var activesData
        var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

        if (actives && actives.length) {
            activesData = actives.data('bs.collapse')
            if (activesData && activesData.transitioning) return
        }

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        if (actives && actives.length) {
            Plugin.call(actives, 'hide')
            activesData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true)

        this.$trigger
            .removeClass('collapsed')
            .attr('aria-expanded', true)

        this.transitioning = 1

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')[dimension]('')
            this.transitioning = 0
            this.$element
                .trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse in')
            .attr('aria-expanded', false)

        this.$trigger
            .addClass('collapsed')
            .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function () {
            this.transitioning = 0
            this.$element
                .removeClass('collapsing')
                .addClass('collapse')
                .trigger('hidden.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
            [dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }

    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

    Collapse.prototype.getParent = function () {
        return $(this.options.parent)
            .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
            .each($.proxy(function (i, element) {
                var $element = $(element)
                this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
            }, this))
            .end()
    }

    Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass('in')

        $element.attr('aria-expanded', isOpen)
        $trigger
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen)
    }

    function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target')
            || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

        return $(target)
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && options.toggle && option == 'show') options.toggle = false
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.collapse

    $.fn.collapse             = Plugin
    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
        var $this   = $(this)

        if (!$this.attr('data-target')) e.preventDefault()

        var $target = getTargetFromTrigger($this)
        var data    = $target.data('bs.collapse')
        var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

        Plugin.call($target, option)
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle   = '[data-toggle="dropdown"]'
    var Dropdown = function (element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.VERSION = '3.3.0'

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this)

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        clearMenus()

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true')

            $parent
                .toggleClass('open')
                .trigger('shown.bs.dropdown', relatedTarget)
        }

        return false
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27|32)/.test(e.which)) return

        var $this = $(this)

        e.preventDefault()
        e.stopPropagation()

        if ($this.is('.disabled, :disabled')) return

        var $parent  = getParent($this)
        var isActive = $parent.hasClass('open')

        if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }

        var desc = ' li:not(.divider):visible a'
        var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

        if (!$items.length) return

        var index = $items.index(e.target)

        if (e.which == 38 && index > 0)                 index--                        // up
        if (e.which == 40 && index < $items.length - 1) index++                        // down
        if (!~index)                                      index = 0

        $items.eq(index).trigger('focus')
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function () {
            var $this         = $(this)
            var $parent       = getParent($this)
            var relatedTarget = { relatedTarget: this }

            if (!$parent.hasClass('open')) return

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

            if (e.isDefaultPrevented()) return

            $this.attr('aria-expanded', 'false')
            $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
        })
    }

    function getParent($this) {
        var selector = $this.attr('data-target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        var $parent = selector && $(selector)

        return $parent && $parent.length ? $parent : $this.parent()
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.dropdown')

            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.dropdown

    $.fn.dropdown             = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
        .on('click.bs.dropdown.data-api', clearMenus)
        .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
        .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
        .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options        = options
        this.$body          = $(document.body)
        this.$element       = $(element)
        this.$backdrop      =
            this.isShown        = null
        this.scrollbarWidth = 0

        if (this.options.remote) {
            this.$element
                .find('.modal-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.bs.modal')
                }, this))
        }
    }

    Modal.VERSION  = '3.3.0'

    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150

    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.checkScrollbar()
        this.$body.addClass('modal-open')

        this.setScrollbar()
        this.escape()

        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body) // don't move modals dom position
            }

            that.$element
                .show()
                .scrollTop(0)

            if (transition) {
                that.$element[0].offsetWidth // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false)

            that.enforceFocus()

            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

            transition ?
                that.$element.find('.modal-dialog') // wait for modal to slide in
                    .one('bsTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    }

    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault()

        e = $.Event('hide.bs.modal')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.bs.modal')

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.bs.modal')

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
            this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.bs.modal') // guard against infinite focus loop
            .on('focusin.bs.modal', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    }

    Modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    }

    Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.$body.removeClass('modal-open')
            that.resetScrollbar()
            that.$element.trigger('hidden.bs.modal')
        })
    }

    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .prependTo(this.$element)
                .on('click.dismiss.bs.modal', $.proxy(function (e) {
                    if (e.target !== e.currentTarget) return
                    this.options.backdrop == 'static'
                        ? this.$element[0].focus.call(this.$element[0])
                        : this.hide.call(this)
                }, this))

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            if (!callback) return

            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            var callbackRemove = function () {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    }

    Modal.prototype.checkScrollbar = function () {
        this.scrollbarWidth = this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
        if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', '')
    }

    Modal.prototype.measureScrollbar = function () { // thx walsh
        if (document.body.clientWidth >= window.innerWidth) return 0
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.modal

    $.fn.modal             = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this   = $(this)
        var href    = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
        var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

        if ($this.is('a')) e.preventDefault()

        $target.one('show.bs.modal', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
            $target.one('hidden.bs.modal', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this)
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type       =
            this.options    =
                this.enabled    =
                    this.timeout    =
                        this.hoverState =
                            this.$element   = null

        this.init('tooltip', element, options)
    }

    Tooltip.VERSION  = '3.3.0'

    Tooltip.TRANSITION_DURATION = 150

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled   = true
        this.type      = type
        this.$element  = $(element)
        this.options   = this.getOptions(options)
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options  = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (self && self.$tip && self.$tip.is(':visible')) {
            self.hoverState = 'in'
            return
        }

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

            var pos          = this.getPosition()
            var actualWidth  = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
                var containerDim = this.getPosition($container)

                placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                        placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                            placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                                placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function () {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null

                if (prevHoverState == 'out') that.leave(that)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one('bsTransitionEnd', complete)
                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip   = this.tip()
        var width  = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop  = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top  = offset.top  + marginTop
        offset.left = offset.left + marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth  = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical          = /top|bottom/.test(placement)
        var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
        this.arrow()
            .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isHorizontal ? 'top' : 'left', '')
    }

    Tooltip.prototype.setContent = function () {
        var $tip  = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function (callback) {
        var that = this
        var $tip = this.tip()
        var e    = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            that.$element
                .removeAttr('aria-describedby')
                .trigger('hidden.bs.' + that.type)
            callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && this.$tip.hasClass('fade') ?
            $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function ($element) {
        $element   = $element || this.$element

        var el     = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect    = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
        var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
            placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
                placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset  = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o  = this.options

        title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

        return title
    }

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function () {
        return (this.$tip = this.$tip || $(this.options.template))
    }

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }

    Tooltip.prototype.destroy = function () {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
        })
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this    = $(this)
            var data     = $this.data('bs.tooltip')
            var options  = typeof option == 'object' && option
            var selector = options && options.selector

            if (!data && option == 'destroy') return
            if (selector) {
                if (!data) $this.data('bs.tooltip', (data = {}))
                if (!data[selector]) data[selector] = new Tooltip(this, options)
            } else {
                if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            }
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip             = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.VERSION  = '3.3.0'

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
        return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
        var $tip    = this.tip()
        var title   = this.getTitle()
        var content = this.getContent()

        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
            this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
            ](content)

        $tip.removeClass('fade top bottom left right in')

        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
        var $e = this.$element
        var o  = this.options

        return $e.attr('data-content')
        || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
    }

    Popover.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }

    Popover.prototype.tip = function () {
        if (!this.$tip) this.$tip = $(this.options.template)
        return this.$tip
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this    = $(this)
            var data     = $this.data('bs.popover')
            var options  = typeof option == 'object' && option
            var selector = options && options.selector

            if (!data && option == 'destroy') return
            if (selector) {
                if (!data) $this.data('bs.popover', (data = {}))
                if (!data[selector]) data[selector] = new Popover(this, options)
            } else {
                if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            }
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.popover             = Plugin
    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
        var process  = $.proxy(this.process, this)

        this.$body          = $('body')
        this.$scrollElement = $(element).is('body') ? $(window) : $(element)
        this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector       = (this.options.target || '') + ' .nav li > a'
        this.offsets        = []
        this.targets        = []
        this.activeTarget   = null
        this.scrollHeight   = 0

        this.$scrollElement.on('scroll.bs.scrollspy', process)
        this.refresh()
        this.process()
    }

    ScrollSpy.VERSION  = '3.3.0'

    ScrollSpy.DEFAULTS = {
        offset: 10
    }

    ScrollSpy.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    ScrollSpy.prototype.refresh = function () {
        var offsetMethod = 'offset'
        var offsetBase   = 0

        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase   = this.$scrollElement.scrollTop()
        }

        this.offsets = []
        this.targets = []
        this.scrollHeight = this.getScrollHeight()

        var self     = this

        this.$body
            .find(this.selector)
            .map(function () {
                var $el   = $(this)
                var href  = $el.data('target') || $el.attr('href')
                var $href = /^#./.test(href) && $(href)

                return ($href
                && $href.length
                && $href.is(':visible')
                && [[$href[offsetMethod]().top + offsetBase, href]]) || null
            })
            .sort(function (a, b) { return a[0] - b[0] })
            .each(function () {
                self.offsets.push(this[0])
                self.targets.push(this[1])
            })
    }

    ScrollSpy.prototype.process = function () {
        var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets      = this.offsets
        var targets      = this.targets
        var activeTarget = this.activeTarget
        var i

        if (this.scrollHeight != scrollHeight) {
            this.refresh()
        }

        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }

        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
        }

        for (i = offsets.length; i--;) {
            activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate(targets[i])
        }
    }

    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target

        this.clear()

        var selector = this.selector +
            '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'

        var active = $(selector)
            .parents('li')
            .addClass('active')

        if (active.parent('.dropdown-menu').length) {
            active = active
                .closest('li.dropdown')
                .addClass('active')
        }

        active.trigger('activate.bs.scrollspy')
    }

    ScrollSpy.prototype.clear = function () {
        $(this.selector)
            .parentsUntil(this.options.target, '.active')
            .removeClass('active')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.scrollspy

    $.fn.scrollspy             = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load.bs.scrollspy.data-api', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            Plugin.call($spy, $spy.data())
        })
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
        this.element = $(element)
    }

    Tab.VERSION = '3.3.0'

    Tab.TRANSITION_DURATION = 150

    Tab.prototype.show = function () {
        var $this    = this.element
        var $ul      = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }

    Tab.prototype.activate = function (element, container, callback) {
        var $active    = container.find('> .active')
        var transition = callback
            && $.support.transition
            && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false)

            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true)

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu')) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next()

        $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.tab')

            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tab

    $.fn.tab             = Plugin
    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    var clickHandler = function (e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)

        this.$target = $(this.options.target)
            .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

        this.$element     = $(element)
        this.affixed      =
            this.unpin        =
                this.pinnedOffset = null

        this.checkPosition()
    }

    Affix.VERSION  = '3.3.0'

    Affix.RESET    = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
        offset: 0,
        target: window
    }

    Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop    = this.$target.scrollTop()
        var position     = this.$element.offset()
        var targetHeight = this.$target.height()

        if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

        if (this.affixed == 'bottom') {
            if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }

        var initializing   = this.affixed == null
        var colliderTop    = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height

        if (offsetTop != null && colliderTop <= offsetTop) return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

        return false
    }

    Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position  = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }

    Affix.prototype.checkPositionWithEventLoop = function () {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var height       = this.$element.height()
        var offset       = this.options.offset
        var offsetTop    = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = $('body').height()

        if (typeof offset != 'object')         offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css('top', '')

            var affixType = 'affix' + (affix ? '-' + affix : '')
            var e         = $.Event(affixType + '.bs.affix')

            this.$element.trigger(e)

            if (e.isDefaultPrevented()) return

            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

            this.$element
                .removeClass(Affix.RESET)
                .addClass(affixType)
                .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }

        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.affix')
            var options = typeof option == 'object' && option

            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.affix

    $.fn.affix             = Plugin
    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
            var data = $spy.data()

            data.offset = data.offset || {}

            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
            if (data.offsetTop    != null) data.offset.top    = data.offsetTop

            Plugin.call($spy, data)
        })
    })

}(jQuery);


/**! Notify.js - v0.3.1 - 2014/06/29
 * http://notifyjs.com/
 * Copyright (c) 2014 Jaime Pillora - MIT
 */
(function(window,document,$,undefined) {
    'use strict';

    var Notification, addStyle, blankFieldName, coreStyle, createElem, defaults, encode, find, findFields, getAnchorElement, getStyle, globalAnchors, hAligns, incr, inherit, insertCSS, mainPositions, opposites, parsePosition, pluginClassName, pluginName, pluginOptions, positions, realign, stylePrefixes, styles, vAligns,
        __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    pluginName = 'notify';

    pluginClassName = pluginName + 'js';

    blankFieldName = pluginName + "!blank";

    positions = {
        t: 'top',
        m: 'middle',
        b: 'bottom',
        l: 'left',
        c: 'center',
        r: 'right'
    };

    hAligns = ['l', 'c', 'r'];

    vAligns = ['t', 'm', 'b'];

    mainPositions = ['t', 'b', 'l', 'r'];

    opposites = {
        t: 'b',
        m: null,
        b: 't',
        l: 'r',
        c: null,
        r: 'l'
    };

    parsePosition = function(str) {
        var pos;
        pos = [];
        $.each(str.split(/\W+/), function(i, word) {
            var w;
            w = word.toLowerCase().charAt(0);
            if (positions[w]) {
                return pos.push(w);
            }
        });
        return pos;
    };

    styles = {};

    coreStyle = {
        name: 'core',
        html: "<div class=\"" + pluginClassName + "-wrapper\">\n  <div class=\"" + pluginClassName + "-arrow\"></div>\n  <div class=\"" + pluginClassName + "-container\"></div>\n</div>",
        css: "." + pluginClassName + "-corner {\n  position: fixed;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + pluginClassName + "-corner ." + pluginClassName + "-wrapper,\n." + pluginClassName + "-corner ." + pluginClassName + "-container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n  margin: 3px;\n}\n\n." + pluginClassName + "-wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n." + pluginClassName + "-container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n}\n\n." + pluginClassName + "-hidable {\n  cursor: pointer;\n}\n\n[data-notify-text],[data-notify-html] {\n  position: relative;\n}\n\n." + pluginClassName + "-arrow {\n  position: absolute;\n  z-index: 2;\n  width: 0;\n  height: 0;\n}"
    };

    stylePrefixes = {
        "border-radius": ["-webkit-", "-moz-"]
    };

    getStyle = function(name) {
        return styles[name];
    };

    addStyle = function(name, def) {
        var cssText, elem, fields, _ref;
        if (!name) {
            throw "Missing Style name";
        }
        if (!def) {
            throw "Missing Style definition";
        }
        if (!def.html) {
            throw "Missing Style HTML";
        }
        if ((_ref = styles[name]) != null ? _ref.cssElem : void 0) {
            if (window.console) {
                console.warn("" + pluginName + ": overwriting style '" + name + "'");
            }
            styles[name].cssElem.remove();
        }
        def.name = name;
        styles[name] = def;
        cssText = "";
        if (def.classes) {
            $.each(def.classes, function(className, props) {
                cssText += "." + pluginClassName + "-" + def.name + "-" + className + " {\n";
                $.each(props, function(name, val) {
                    if (stylePrefixes[name]) {
                        $.each(stylePrefixes[name], function(i, prefix) {
                            return cssText += "  " + prefix + name + ": " + val + ";\n";
                        });
                    }
                    return cssText += "  " + name + ": " + val + ";\n";
                });
                return cssText += "}\n";
            });
        }
        if (def.css) {
            cssText += "/* styles for " + def.name + " */\n" + def.css;
        }
        if (cssText) {
            def.cssElem = insertCSS(cssText);
            def.cssElem.attr('id', "notify-" + def.name);
        }
        fields = {};
        elem = $(def.html);
        findFields('html', elem, fields);
        findFields('text', elem, fields);
        return def.fields = fields;
    };

    insertCSS = function(cssText) {
        var elem;
        elem = createElem("style");
        elem.attr('type', 'text/css');
        $("head").append(elem);
        try {
            elem.html(cssText);
        } catch (e) {
            elem[0].styleSheet.cssText = cssText;
        }
        return elem;
    };

    findFields = function(type, elem, fields) {
        var attr;
        if (type !== 'html') {
            type = 'text';
        }
        attr = "data-notify-" + type;
        return find(elem, "[" + attr + "]").each(function() {
            var name;
            name = $(this).attr(attr);
            if (!name) {
                name = blankFieldName;
            }
            return fields[name] = type;
        });
    };

    find = function(elem, selector) {
        if (elem.is(selector)) {
            return elem;
        } else {
            return elem.find(selector);
        }
    };

    pluginOptions = {
        clickToHide: true,
        autoHide: true,
        autoHideDelay: 5000,
        arrowShow: true,
        arrowSize: 5,
        breakNewLines: true,
        elementPosition: 'bottom',
        globalPosition: 'top right',
        style: 'bootstrap',
        className: 'error',
        showAnimation: 'slideDown',
        showDuration: 400,
        hideAnimation: 'slideUp',
        hideDuration: 200,
        gap: 5
    };

    inherit = function(a, b) {
        var F;
        F = function() {};
        F.prototype = a;
        return $.extend(true, new F(), b);
    };

    defaults = function(opts) {
        return $.extend(pluginOptions, opts);
    };

    createElem = function(tag) {
        return $("<" + tag + "></" + tag + ">");
    };

    globalAnchors = {};

    getAnchorElement = function(element) {
        var radios;
        if (element.is('[type=radio]')) {
            radios = element.parents('form:first').find('[type=radio]').filter(function(i, e) {
                return $(e).attr('name') === element.attr('name');
            });
            element = radios.first();
        }
        return element;
    };

    incr = function(obj, pos, val) {
        var opp, temp;
        if (typeof val === 'string') {
            val = parseInt(val, 10);
        } else if (typeof val !== 'number') {
            return;
        }
        if (isNaN(val)) {
            return;
        }
        opp = positions[opposites[pos.charAt(0)]];
        temp = pos;
        if (obj[opp] !== undefined) {
            pos = positions[opp.charAt(0)];
            val = -val;
        }
        if (obj[pos] === undefined) {
            obj[pos] = val;
        } else {
            obj[pos] += val;
        }
        return null;
    };

    realign = function(alignment, inner, outer) {
        if (alignment === 'l' || alignment === 't') {
            return 0;
        } else if (alignment === 'c' || alignment === 'm') {
            return outer / 2 - inner / 2;
        } else if (alignment === 'r' || alignment === 'b') {
            return outer - inner;
        }
        throw "Invalid alignment";
    };

    encode = function(text) {
        encode.e = encode.e || createElem("div");
        return encode.e.text(text).html();
    };

    Notification = (function() {

        function Notification(elem, data, options) {
            if (typeof options === 'string') {
                options = {
                    className: options
                };
            }
            this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
            this.loadHTML();
            this.wrapper = $(coreStyle.html);
            if (this.options.clickToHide) {
                this.wrapper.addClass("" + pluginClassName + "-hidable");
            }
            this.wrapper.data(pluginClassName, this);
            this.arrow = this.wrapper.find("." + pluginClassName + "-arrow");
            this.container = this.wrapper.find("." + pluginClassName + "-container");
            this.container.append(this.userContainer);
            if (elem && elem.length) {
                this.elementType = elem.attr('type');
                this.originalElement = elem;
                this.elem = getAnchorElement(elem);
                this.elem.data(pluginClassName, this);
                this.elem.before(this.wrapper);
            }
            this.container.hide();
            this.run(data);
        }

        Notification.prototype.loadHTML = function() {
            var style;
            style = this.getStyle();
            this.userContainer = $(style.html);
            return this.userFields = style.fields;
        };

        Notification.prototype.show = function(show, userCallback) {
            var args, callback, elems, fn, hidden,
                _this = this;
            callback = function() {
                if (!show && !_this.elem) {
                    _this.destroy();
                }
                if (userCallback) {
                    return userCallback();
                }
            };
            hidden = this.container.parent().parents(':hidden').length > 0;
            elems = this.container.add(this.arrow);
            args = [];
            if (hidden && show) {
                fn = 'show';
            } else if (hidden && !show) {
                fn = 'hide';
            } else if (!hidden && show) {
                fn = this.options.showAnimation;
                args.push(this.options.showDuration);
            } else if (!hidden && !show) {
                fn = this.options.hideAnimation;
                args.push(this.options.hideDuration);
            } else {
                return callback();
            }
            args.push(callback);
            return elems[fn].apply(elems, args);
        };

        Notification.prototype.setGlobalPosition = function() {
            var align, anchor, css, key, main, pAlign, pMain, _ref;
            _ref = this.getPosition(), pMain = _ref[0], pAlign = _ref[1];
            main = positions[pMain];
            align = positions[pAlign];
            key = pMain + "|" + pAlign;
            anchor = globalAnchors[key];
            if (!anchor) {
                anchor = globalAnchors[key] = createElem("div");
                css = {};
                css[main] = 0;
                if (align === 'middle') {
                    css.top = '45%';
                } else if (align === 'center') {
                    css.left = '45%';
                } else {
                    css[align] = 0;
                }
                anchor.css(css).addClass("" + pluginClassName + "-corner");
                $("body").append(anchor);
            }
            return anchor.prepend(this.wrapper);
        };

        Notification.prototype.setElementPosition = function() {
            var arrowColor, arrowCss, arrowSize, color, contH, contW, css, elemH, elemIH, elemIW, elemPos, elemW, gap, mainFull, margin, opp, oppFull, pAlign, pArrow, pMain, pos, posFull, position, wrapPos, _i, _j, _len, _len1, _ref;
            position = this.getPosition();
            pMain = position[0], pAlign = position[1], pArrow = position[2];
            elemPos = this.elem.position();
            elemH = this.elem.outerHeight();
            elemW = this.elem.outerWidth();
            elemIH = this.elem.innerHeight();
            elemIW = this.elem.innerWidth();
            wrapPos = this.wrapper.position();
            contH = this.container.height();
            contW = this.container.width();
            mainFull = positions[pMain];
            opp = opposites[pMain];
            oppFull = positions[opp];
            css = {};
            css[oppFull] = pMain === 'b' ? elemH : pMain === 'r' ? elemW : 0;
            incr(css, 'top', elemPos.top - wrapPos.top);
            incr(css, 'left', elemPos.left - wrapPos.left);
            _ref = ['top', 'left'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                pos = _ref[_i];
                margin = parseInt(this.elem.css("margin-" + pos), 10);
                if (margin) {
                    incr(css, pos, margin);
                }
            }
            gap = Math.max(0, this.options.gap - (this.options.arrowShow ? arrowSize : 0));
            incr(css, oppFull, gap);
            if (!this.options.arrowShow) {
                this.arrow.hide();
            } else {
                arrowSize = this.options.arrowSize;
                arrowCss = $.extend({}, css);
                arrowColor = this.userContainer.css("border-color") || this.userContainer.css("background-color") || 'white';
                for (_j = 0, _len1 = mainPositions.length; _j < _len1; _j++) {
                    pos = mainPositions[_j];
                    posFull = positions[pos];
                    if (pos === opp) {
                        continue;
                    }
                    color = posFull === mainFull ? arrowColor : 'transparent';
                    arrowCss["border-" + posFull] = "" + arrowSize + "px solid " + color;
                }
                incr(css, positions[opp], arrowSize);
                if (__indexOf.call(mainPositions, pAlign) >= 0) {
                    incr(arrowCss, positions[pAlign], arrowSize * 2);
                }
            }
            if (__indexOf.call(vAligns, pMain) >= 0) {
                incr(css, 'left', realign(pAlign, contW, elemW));
                if (arrowCss) {
                    incr(arrowCss, 'left', realign(pAlign, arrowSize, elemIW));
                }
            } else if (__indexOf.call(hAligns, pMain) >= 0) {
                incr(css, 'top', realign(pAlign, contH, elemH));
                if (arrowCss) {
                    incr(arrowCss, 'top', realign(pAlign, arrowSize, elemIH));
                }
            }
            if (this.container.is(":visible")) {
                css.display = 'block';
            }
            this.container.removeAttr('style').css(css);
            if (arrowCss) {
                return this.arrow.removeAttr('style').css(arrowCss);
            }
        };

        Notification.prototype.getPosition = function() {
            var pos, text, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
            text = this.options.position || (this.elem ? this.options.elementPosition : this.options.globalPosition);
            pos = parsePosition(text);
            if (pos.length === 0) {
                pos[0] = 'b';
            }
            if (_ref = pos[0], __indexOf.call(mainPositions, _ref) < 0) {
                throw "Must be one of [" + mainPositions + "]";
            }
            if (pos.length === 1 || ((_ref1 = pos[0], __indexOf.call(vAligns, _ref1) >= 0) && (_ref2 = pos[1], __indexOf.call(hAligns, _ref2) < 0)) || ((_ref3 = pos[0], __indexOf.call(hAligns, _ref3) >= 0) && (_ref4 = pos[1], __indexOf.call(vAligns, _ref4) < 0))) {
                pos[1] = (_ref5 = pos[0], __indexOf.call(hAligns, _ref5) >= 0) ? 'm' : 'l';
            }
            if (pos.length === 2) {
                pos[2] = pos[1];
            }
            return pos;
        };

        Notification.prototype.getStyle = function(name) {
            var style;
            if (!name) {
                name = this.options.style;
            }
            if (!name) {
                name = 'default';
            }
            style = styles[name];
            if (!style) {
                throw "Missing style: " + name;
            }
            return style;
        };

        Notification.prototype.updateClasses = function() {
            var classes, style;
            classes = ['base'];
            if ($.isArray(this.options.className)) {
                classes = classes.concat(this.options.className);
            } else if (this.options.className) {
                classes.push(this.options.className);
            }
            style = this.getStyle();
            classes = $.map(classes, function(n) {
                return "" + pluginClassName + "-" + style.name + "-" + n;
            }).join(' ');
            return this.userContainer.attr('class', classes);
        };

        Notification.prototype.run = function(data, options) {
            var d, datas, name, type, value,
                _this = this;
            if ($.isPlainObject(options)) {
                $.extend(this.options, options);
            } else if ($.type(options) === 'string') {
                this.options.className = options;
            }
            if (this.container && !data) {
                this.show(false);
                return;
            } else if (!this.container && !data) {
                return;
            }
            datas = {};
            if ($.isPlainObject(data)) {
                datas = data;
            } else {
                datas[blankFieldName] = data;
            }
            for (name in datas) {
                d = datas[name];
                type = this.userFields[name];
                if (!type) {
                    continue;
                }
                if (type === 'text') {
                    d = encode(d);
                    if (this.options.breakNewLines) {
                        d = d.replace(/\n/g, '<br/>');
                    }
                }
                value = name === blankFieldName ? '' : '=' + name;
                find(this.userContainer, "[data-notify-" + type + value + "]").html(d);
            }
            this.updateClasses();
            if (this.elem) {
                this.setElementPosition();
            } else {
                this.setGlobalPosition();
            }
            this.show(true);
            if (this.options.autoHide) {
                clearTimeout(this.autohideTimer);
                return this.autohideTimer = setTimeout(function() {
                    return _this.show(false);
                }, this.options.autoHideDelay);
            }
        };

        Notification.prototype.destroy = function() {
            return this.wrapper.remove();
        };

        return Notification;

    })();

    $[pluginName] = function(elem, data, options) {
        if ((elem && elem.nodeName) || elem.jquery) {
            $(elem)[pluginName](data, options);
        } else {
            options = data;
            data = elem;
            new Notification(null, data, options);
        }
        return elem;
    };

    $.fn[pluginName] = function(data, options) {
        $(this).each(function() {
            var inst;
            inst = getAnchorElement($(this)).data(pluginClassName);
            if (inst) {
                return inst.run(data, options);
            } else {
                return new Notification($(this), data, options);
            }
        });
        return this;
    };

    $.extend($[pluginName], {
        defaults: defaults,
        addStyle: addStyle,
        pluginOptions: pluginOptions,
        getStyle: getStyle,
        insertCSS: insertCSS
    });

    $(function() {
        insertCSS(coreStyle.css).attr('id', 'core-notify');
        $(document).on('click', "." + pluginClassName + "-hidable", function(e) {
            return $(this).trigger('notify-hide');
        });
        return $(document).on('notify-hide', "." + pluginClassName + "-wrapper", function(e) {
            var _ref;
            return (_ref = $(this).data(pluginClassName)) != null ? _ref.show(false) : void 0;
        });
    });

}(window,document,jQuery));

$.notify.addStyle("bootstrap", {
    html: "<div>\n<span data-notify-text></span>\n</div>",
    classes: {
        base: {
            "font-weight": "bold",
            "padding": "8px 15px 8px 14px",
            "text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
            "background-color": "#fcf8e3",
            "border": "1px solid #fbeed5",
            "border-radius": "4px",
            "white-space": "nowrap",
            "padding-left": "25px",
            "background-repeat": "no-repeat",
            "background-position": "3px 7px"
        },
        error: {
            "color": "#B94A48",
            "background-color": "#F2DEDE",
            "border-color": "#EED3D7",
            "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)"
        },
        success: {
            "color": "#468847",
            "background-color": "#DFF0D8",
            "border-color": "#D6E9C6",
            "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"
        },
        info: {
            "color": "#3A87AD",
            "background-color": "#D9EDF7",
            "border-color": "#BCE8F1",
            "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"
        },
        warn: {
            "color": "#C09853",
            "background-color": "#FCF8E3",
            "border-color": "#FBEED5",
            "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"
        }
    }
});


/**! Sweet alert */
!function(e,t,n){function o(){function o(e){var t=y;return"undefined"!=typeof t[e]?(null,t[e]):(null,b[e])}function l(t){var o=t||e.event,r=o.keyCode||o.which;if(-1!==[9,13,32,27].indexOf(r)){for(var a=o.target||o.srcElement,i=-1,l=0;l<T.length;l++)if(a===T[l]){i=l;break}9===r?(a=-1===i?E:i===T.length-1?T[0]:T[i+1],L(o),a.focus(),s(a,v.confirmButtonColor)):(a=13===r||32===r?-1===i?E:n:27===r&&v.allowEscapeKey===!0?A:n,a!==n&&D(a,o))}}function f(t){var n=t||e.event,o=n.target||n.srcElement,r=n.relatedTarget,a=S(h,"visible");if(a){var i=-1;if(null!==r){for(var l=0;l<T.length;l++)if(r===T[l]){i=l;break}-1===i&&o.focus()}else m=o}}var y=arguments[0];if(arguments[0]===n)return e.console.error("SweetAlert expects at least 1 attribute!"),!1;var v=i({},b);switch(typeof arguments[0]){case"string":v.title=arguments[0],v.text=arguments[1]||"",v.type=arguments[2]||"";break;case"object":if(arguments[0].title===n)return e.console.error('Missing "title" argument!'),!1;v.title=arguments[0].title;var g=["text","type","customClass","allowOutsideClick","showCancelButton","closeOnConfirm","closeOnCancel","timer","confirmButtonColor","cancelButtonText","imageUrl","imageSize","html","animation","allowEscapeKey"];g.forEach(function(e){v[e]=o(e)}),v.confirmButtonText=v.showCancelButton?"Confirm":b.confirmButtonText,v.confirmButtonText=o("confirmButtonText"),v.doneFunction=arguments[1]||null;break;default:return e.console.error('Unexpected type of argument! Expected "string" or "object", got '+typeof arguments[0]),!1}r(v),u(),c();for(var h=w(),x=function(t){var n=t||e.event,o=n.target||n.srcElement,r=-1!==o.className.indexOf("confirm"),i=S(h,"visible"),l=v.doneFunction&&"true"===h.getAttribute("data-has-done-function");switch(n.type){case"mouseover":r&&(o.style.backgroundColor=a(v.confirmButtonColor,-.04));break;case"mouseout":r&&(o.style.backgroundColor=v.confirmButtonColor);break;case"mousedown":r&&(o.style.backgroundColor=a(v.confirmButtonColor,-.14));break;case"mouseup":r&&(o.style.backgroundColor=a(v.confirmButtonColor,-.04));break;case"focus":var s=h.querySelector("button.confirm"),c=h.querySelector("button.cancel");r?c.style.boxShadow="none":s.style.boxShadow="none";break;case"click":if(r&&l&&i)v.doneFunction(!0),v.closeOnConfirm&&e.sweetAlert.close();else if(l&&i){var u=String(v.doneFunction).replace(/\s/g,""),f="function("===u.substring(0,9)&&")"!==u.substring(9,10);f&&v.doneFunction(!1),v.closeOnCancel&&e.sweetAlert.close()}else e.sweetAlert.close()}},k=h.querySelectorAll("button"),C=0;C<k.length;C++)k[C].onclick=x,k[C].onmouseover=x,k[C].onmouseout=x,k[C].onmousedown=x,k[C].onfocus=x;d=t.onclick,t.onclick=function(t){var n=t||e.event,o=n.target||n.srcElement,r=h===o,a=B(h,o),i=S(h,"visible"),l="true"===h.getAttribute("data-allow-ouside-click");!r&&!a&&i&&l&&e.sweetAlert.close()};var E=h.querySelector("button.confirm"),A=h.querySelector("button.cancel"),T=h.querySelectorAll("button:not([type=hidden])");p=e.onkeydown,e.onkeydown=l,E.onblur=f,A.onblur=f,e.onfocus=function(){e.setTimeout(function(){m!==n&&(m.focus(),m=n)},0)}}function r(t){var n=w(),o=n.querySelector("h2"),r=n.querySelector("p"),a=n.querySelector("button.cancel"),i=n.querySelector("button.confirm");if(o.innerHTML=t.html?t.title:C(t.title).split("\n").join("<br>"),r.innerHTML=t.html?t.text:C(t.text||"").split("\n").join("<br>"),t.text&&A(r),t.customClass)x(n,t.customClass),n.setAttribute("data-custom-class",t.customClass);else{var l=n.getAttribute("data-custom-class");k(n,l),n.setAttribute("data-custom-class","")}if(q(n.querySelectorAll(".icon")),t.type){for(var c=!1,u=0;u<g.length;u++)if(t.type===g[u]){c=!0;break}if(!c)return e.console.error("Unknown alert type: "+t.type),!1;var f=n.querySelector(".icon."+t.type);switch(A(f),t.type){case"success":x(f,"animate"),x(f.querySelector(".tip"),"animateSuccessTip"),x(f.querySelector(".long"),"animateSuccessLong");break;case"error":x(f,"animateErrorIcon"),x(f.querySelector(".x-mark"),"animateXMark");break;case"warning":x(f,"pulseWarning"),x(f.querySelector(".body"),"pulseWarningIns"),x(f.querySelector(".dot"),"pulseWarningIns")}}if(t.imageUrl){var d=n.querySelector(".icon.custom");d.style.backgroundImage="url("+t.imageUrl+")",A(d);var p=80,m=80;if(t.imageSize){var y=t.imageSize.split("x")[0],v=t.imageSize.split("x")[1];y&&v?(p=y,m=v,d.css({width:y+"px",height:v+"px"})):e.console.error("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+t.imageSize)}d.setAttribute("style",d.getAttribute("style")+"width:"+p+"px; height:"+m+"px")}n.setAttribute("data-has-cancel-button",t.showCancelButton),t.showCancelButton?a.style.display="inline-block":q(a),t.cancelButtonText&&(a.innerHTML=C(t.cancelButtonText)),t.confirmButtonText&&(i.innerHTML=C(t.confirmButtonText)),i.style.backgroundColor=t.confirmButtonColor,s(i,t.confirmButtonColor),n.setAttribute("data-allow-ouside-click",t.allowOutsideClick);var b=t.doneFunction?!0:!1;n.setAttribute("data-has-done-function",b),t.animation?n.setAttribute("data-animation","pop"):n.setAttribute("data-animation","none"),n.setAttribute("data-timer",t.timer)}function a(e,t){e=String(e).replace(/[^0-9a-f]/gi,""),e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=t||0;var n,o,r="#";for(o=0;3>o;o++)n=parseInt(e.substr(2*o,2),16),n=Math.round(Math.min(Math.max(0,n+n*t),255)).toString(16),r+=("00"+n).substr(n.length);return r}function i(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function l(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?parseInt(t[1],16)+", "+parseInt(t[2],16)+", "+parseInt(t[3],16):null}function s(e,t){var n=l(t);e.style.boxShadow="0 0 2px rgba("+n+", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"}function c(){var n=w();O(h(),10),A(n),x(n,"showSweetAlert"),k(n,"hideSweetAlert"),f=t.activeElement;var o=n.querySelector("button.confirm");o.focus(),setTimeout(function(){x(n,"visible")},500);var r=n.getAttribute("data-timer");"null"!==r&&""!==r&&(n.timeout=setTimeout(function(){e.sweetAlert.close()},r))}function u(){var e=w();e.style.marginTop=I(w())}var f,d,p,m,y=".sweet-alert",v=".sweet-overlay",g=["error","warning","info","success"],b={title:"",text:"",type:null,allowOutsideClick:!1,showCancelButton:!1,closeOnConfirm:!0,closeOnCancel:!0,confirmButtonText:"OK",confirmButtonColor:"#AEDEF4",cancelButtonText:"Cancel",imageUrl:null,imageSize:null,timer:null,customClass:"",html:!1,animation:!0,allowEscapeKey:!0},w=function(){return t.querySelector(y)},h=function(){return t.querySelector(v)},S=function(e,t){return new RegExp(" "+t+" ").test(" "+e.className+" ")},x=function(e,t){S(e,t)||(e.className+=" "+t)},k=function(e,t){var n=" "+e.className.replace(/[\t\r\n]/g," ")+" ";if(S(e,t)){for(;n.indexOf(" "+t+" ")>=0;)n=n.replace(" "+t+" "," ");e.className=n.replace(/^\s+|\s+$/g,"")}},C=function(e){var n=t.createElement("div");return n.appendChild(t.createTextNode(e)),n.innerHTML},E=function(e){e.style.opacity="",e.style.display="block"},A=function(e){if(e&&!e.length)return E(e);for(var t=0;t<e.length;++t)E(e[t])},T=function(e){e.style.opacity="",e.style.display="none"},q=function(e){if(e&&!e.length)return T(e);for(var t=0;t<e.length;++t)T(e[t])},B=function(e,t){for(var n=t.parentNode;null!==n;){if(n===e)return!0;n=n.parentNode}return!1},I=function(e){e.style.left="-9999px",e.style.display="block";var t,n=e.clientHeight;return t="undefined"!=typeof getComputedStyle?parseInt(getComputedStyle(e).getPropertyValue("padding"),10):parseInt(e.currentStyle.padding),e.style.left="",e.style.display="none","-"+parseInt(n/2+t)+"px"},O=function(e,t){if(+e.style.opacity<1){t=t||16,e.style.opacity=0,e.style.display="block";var n=+new Date,o=function(){e.style.opacity=+e.style.opacity+(new Date-n)/100,n=+new Date,+e.style.opacity<1&&setTimeout(o,t)};o()}e.style.display="block"},M=function(e,t){t=t||16,e.style.opacity=1;var n=+new Date,o=function(){e.style.opacity=+e.style.opacity-(new Date-n)/100,n=+new Date,+e.style.opacity>0?setTimeout(o,t):e.style.display="none"};o()},D=function(n){if(MouseEvent){var o=new MouseEvent("click",{view:e,bubbles:!1,cancelable:!0});n.dispatchEvent(o)}else if(t.createEvent){var r=t.createEvent("MouseEvents");r.initEvent("click",!1,!1),n.dispatchEvent(r)}else t.createEventObject?n.fireEvent("onclick"):"function"==typeof n.onclick&&n.onclick()},L=function(t){"function"==typeof t.stopPropagation?(t.stopPropagation(),t.preventDefault()):e.event&&e.event.hasOwnProperty("cancelBubble")&&(e.event.cancelBubble=!0)};e.sweetAlertInitialize=function(){var e='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert" tabIndex="-1"><div class="icon error"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="icon warning"> <span class="body"></span> <span class="dot"></span> </div> <div class="icon info"></div> <div class="icon success"> <span class="line tip"></span> <span class="line long"></span> <div class="placeholder"></div> <div class="fix"></div> </div> <div class="icon custom"></div> <h2>Title</h2><p>Text</p><button class="cancel" tabIndex="2">Cancel</button><button class="confirm" tabIndex="1">OK</button></div>',n=t.createElement("div");for(n.innerHTML=e;n.firstChild;)t.body.appendChild(n.firstChild)},e.sweetAlert=e.swal=function(){var e=arguments;if(null!==w())o.apply(this,e);else var t=setInterval(function(){null!==w()&&(clearInterval(t),o.apply(this,e))},100)},e.sweetAlert.setDefaults=e.swal.setDefaults=function(e){if(!e)throw new Error("userParams is required");if("object"!=typeof e)throw new Error("userParams has to be a object");i(b,e)},e.sweetAlert.close=e.swal.close=function(){var o=w();M(h(),5),M(o,5),k(o,"showSweetAlert"),x(o,"hideSweetAlert"),k(o,"visible");var r=o.querySelector(".icon.success");k(r,"animate"),k(r.querySelector(".tip"),"animateSuccessTip"),k(r.querySelector(".long"),"animateSuccessLong");var a=o.querySelector(".icon.error");k(a,"animateErrorIcon"),k(a.querySelector(".x-mark"),"animateXMark");var i=o.querySelector(".icon.warning");k(i,"pulseWarning"),k(i.querySelector(".body"),"pulseWarningIns"),k(i.querySelector(".dot"),"pulseWarningIns"),e.onkeydown=p,t.onclick=d,f&&f.focus(),m=n,clearTimeout(o.timeout)},function(){"complete"===t.readyState||"interactive"===t.readyState&&t.body?e.sweetAlertInitialize():t.addEventListener?t.addEventListener("DOMContentLoaded",function n(){t.removeEventListener("DOMContentLoaded",n,!1),e.sweetAlertInitialize()},!1):t.attachEvent&&t.attachEvent("onreadystatechange",function o(){"complete"===t.readyState&&(t.detachEvent("onreadystatechange",o),e.sweetAlertInitialize())})}()}(window,document);





/**! -------------------------------------------------------------- JsColor -------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------------------------- */
/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.4
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2014-12-09
 * @link    http://jscolor.com
 */


var jscolor = {
    dir : '', // location of jscolor directory (leave empty to autodetect)
    bindClass : 'color', // class name
    binding : true, // automatic binding via <input class="...">
    preloading : true, // use image preloading?

    //install : function() {
    //    jscolor.addEvent(window, 'load', jscolor.init);
    //},

    init : function() {
        if(jscolor.binding) {
            jscolor.bind();
        }
        if(jscolor.preloading) {
            jscolor.preload();
        }
    },

    getDir : function() {
        if(!jscolor.dir) {
            var detected = jscolor.detectDir();
            jscolor.dir = detected!==false ? detected : 'app/assets/images/';
        }
        return jscolor.dir;
    },

    detectDir : function() {
        var base = location.href;

        var e = document.getElementsByTagName('base');
        for(var i=0; i<e.length; i+=1) {
            if(e[i].href) { base = e[i].href; }
        }

        var e = document.getElementsByTagName('script');
        for(var i=0; i<e.length; i+=1) {
            if(e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
                var src = new jscolor.URI(e[i].src);
                var srcAbs = src.toAbsolute(base);
                srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
                srcAbs.query = null;
                srcAbs.fragment = null;
                return srcAbs.toString();
            }
        }
        return false;
    },


    bind : function() {
        var matchClass = new RegExp('(^|\\s)('+jscolor.bindClass+')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');
        var e = document.getElementsByTagName('input');
        for(var i=0; i<e.length; i+=1) {
            if(jscolor.isColorAttrSupported && e[i].type.toLowerCase() == 'color') {
                // skip inputs of type 'color' if the browser supports this feature
                continue;
            }
            var m;
            if(!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
                var prop = {};
                if(m[4]) {
                    try {
                        prop = (new Function ('return (' + m[4] + ')'))();
                    } catch(eInvalidProp) {}
                }
                e[i].color = new jscolor.color(e[i], prop);
            }
        }
    },


    preload : function() {
        for(var fn in jscolor.imgRequire) {
            if(jscolor.imgRequire.hasOwnProperty(fn)) {
                jscolor.loadImage(fn);
            }
        }
    },


    images : {
        pad : [ 181, 101 ],
        sld : [ 16, 101 ],
        cross : [ 15, 15 ],
        arrow : [ 7, 11 ]
    },


    imgRequire : {},
    imgLoaded : {},


    requireImage : function(filename) {
        jscolor.imgRequire[filename] = true;
    },


    loadImage : function(filename) {
        if(!jscolor.imgLoaded[filename]) {
            jscolor.imgLoaded[filename] = new Image();
            jscolor.imgLoaded[filename].src = jscolor.getDir()+filename;
        }
    },


    fetchElement : function(mixed) {
        return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
    },


    addEvent : function(el, evnt, func) {
        if(el.addEventListener) {
            el.addEventListener(evnt, func, false);
        } else if(el.attachEvent) {
            el.attachEvent('on'+evnt, func);
        }
    },


    fireEvent : function(el, evnt) {
        if(!el) {
            return;
        }
        if(document.createEvent) {
            var ev = document.createEvent('HTMLEvents');
            ev.initEvent(evnt, true, true);
            el.dispatchEvent(ev);
        } else if(document.createEventObject) {
            var ev = document.createEventObject();
            el.fireEvent('on'+evnt, ev);
        } else if(el['on'+evnt]) { // alternatively use the traditional event model (IE5)
            el['on'+evnt]();
        }
    },


    getElementPos : function(e) {
        var e1=e, e2=e;
        var x=0, y=0;
        if(e1.offsetParent) {
            do {
                x += e1.offsetLeft;
                y += e1.offsetTop;
            } while(e1 = e1.offsetParent);
        }
        while((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
            x -= e2.scrollLeft;
            y -= e2.scrollTop;
        }
        return [x, y];
    },


    getElementSize : function(e) {
        return [e.offsetWidth, e.offsetHeight];
    },


    getRelMousePos : function(e) {
        var x = 0, y = 0;
        if (!e) { e = window.event; }
        if (typeof e.offsetX === 'number') {
            x = e.offsetX;
            y = e.offsetY;
        } else if (typeof e.layerX === 'number') {
            x = e.layerX;
            y = e.layerY;
        }
        return { x: x, y: y };
    },


    getViewPos : function() {
        if(typeof window.pageYOffset === 'number') {
            return [window.pageXOffset, window.pageYOffset];
        } else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
            return [document.body.scrollLeft, document.body.scrollTop];
        } else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
            return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
        } else {
            return [0, 0];
        }
    },
    
    getViewSize : function() {
        if(typeof window.innerWidth === 'number') {
            return [window.innerWidth, window.innerHeight];
        } else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
            return [document.body.clientWidth, document.body.clientHeight];
        } else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            return [document.documentElement.clientWidth, document.documentElement.clientHeight];
        } else {
            return [0, 0];
        }
    },


    URI : function(uri) { // See RFC3986

        this.scheme = null;
        this.authority = null;
        this.path = '';
        this.query = null;
        this.fragment = null;

        this.parse = function(uri) {
            var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
            this.scheme = m[3] ? m[2] : null;
            this.authority = m[5] ? m[6] : null;
            this.path = m[7];
            this.query = m[9] ? m[10] : null;
            this.fragment = m[12] ? m[13] : null;
            return this;
        };

        this.toString = function() {
            var result = '';
            if(this.scheme !== null) { result = result + this.scheme + ':'; }
            if(this.authority !== null) { result = result + '//' + this.authority; }
            if(this.path !== null) { result = result + this.path; }
            if(this.query !== null) { result = result + '?' + this.query; }
            if(this.fragment !== null) { result = result + '#' + this.fragment; }
            return result;
        };

        this.toAbsolute = function(base) {
            var base = new jscolor.URI(base);
            var r = this;
            var t = new jscolor.URI;

            if(base.scheme === null) { return false; }

            if(r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
                r.scheme = null;
            }

            if(r.scheme !== null) {
                t.scheme = r.scheme;
                t.authority = r.authority;
                t.path = removeDotSegments(r.path);
                t.query = r.query;
            } else {
                if(r.authority !== null) {
                    t.authority = r.authority;
                    t.path = removeDotSegments(r.path);
                    t.query = r.query;
                } else {
                    if(r.path === '') {
                        t.path = base.path;
                        if(r.query !== null) {
                            t.query = r.query;
                        } else {
                            t.query = base.query;
                        }
                    } else {
                        if(r.path.substr(0,1) === '/') {
                            t.path = removeDotSegments(r.path);
                        } else {
                            if(base.authority !== null && base.path === '') {
                                t.path = '/'+r.path;
                            } else {
                                t.path = base.path.replace(/[^\/]+$/,'')+r.path;
                            }
                            t.path = removeDotSegments(t.path);
                        }
                        t.query = r.query;
                    }
                    t.authority = base.authority;
                }
                t.scheme = base.scheme;
            }
            t.fragment = r.fragment;

            return t;
        };

        function removeDotSegments(path) {
            var out = '';
            while(path) {
                if(path.substr(0,3)==='../' || path.substr(0,2)==='./') {
                    path = path.replace(/^\.+/,'').substr(1);
                } else if(path.substr(0,3)==='/./' || path==='/.') {
                    path = '/'+path.substr(3);
                } else if(path.substr(0,4)==='/../' || path==='/..') {
                    path = '/'+path.substr(4);
                    out = out.replace(/\/?[^\/]*$/, '');
                } else if(path==='.' || path==='..') {
                    path = '';
                } else {
                    var rm = path.match(/^\/?[^\/]*/)[0];
                    path = path.substr(rm.length);
                    out = out + rm;
                }
            }
            return out;
        }

        if(uri) {
            this.parse(uri);
        }

    },
    //
    // Usage example:
    // var myColor = new jscolor.color(myInputElement)
    //

    color : function(target, prop) {


        this.required = true; // refuse empty values?
        this.adjust = true; // adjust value to uniform notation?
        this.hash = false; // prefix color with # symbol?
        this.caps = true; // uppercase?
        this.slider = true; // show the value/saturation slider?
        this.valueElement = target; // value holder
        this.styleElement = target; // where to reflect current color
        this.onImmediateChange = null; // onchange callback (can be either string or function)
        this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
        this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1
        this.minH = 0; // read-only  0-6
        this.maxH = 6; // read-only  0-6
        this.minS = 0; // read-only  0-1
        this.maxS = 1; // read-only  0-1
        this.minV = 0; // read-only  0-1
        this.maxV = 1; // read-only  0-1

        this.pickerOnfocus = true; // display picker on focus?
        this.pickerMode = 'HSV'; // HSV | HVS
        this.pickerPosition = 'bottom'; // left | right | top | bottom
        this.pickerSmartPosition = true; // automatically adjust picker position when necessary
        this.pickerButtonHeight = 20; // px
        this.pickerClosable = false;
        this.pickerCloseText = 'Close';
        this.pickerButtonColor = 'ButtonText'; // px
        this.pickerFace = 10; // px
        this.pickerFaceColor = 'ThreeDFace'; // CSS color
        this.pickerBorder = 1; // px
        this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
        this.pickerInset = 1; // px
        this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
        this.pickerZIndex = 10000;


        for(var p in prop) {
            if(prop.hasOwnProperty(p)) {
                this[p] = prop[p];
            }
        }


        this.hidePicker = function() {
            if(isPickerOwner()) {
                removePicker();
            }
        };


        this.showPicker = function() {
            if(!isPickerOwner()) {
                var tp = jscolor.getElementPos(target); // target pos
                var ts = jscolor.getElementSize(target); // target size
                var vp = jscolor.getViewPos(); // view pos
                var vs = jscolor.getViewSize(); // view size
                var ps = getPickerDims(this); // picker size
                var a, b, c;
                switch(this.pickerPosition.toLowerCase()) {
                    case 'left': a=1; b=0; c=-1; break;
                    case 'right':a=1; b=0; c=1; break;
                    case 'top':  a=0; b=1; c=-1; break;
                    default:     a=0; b=1; c=1; break;
                }
                var l = (ts[b]+ps[b])/2;

                // picker pos
                if (!this.pickerSmartPosition) {
                    var pp = [
                        tp[a],
                        tp[b]+ts[b]-l+l*c
                    ];
                } else {
                    var pp = [
                        -vp[a]+tp[a]+ps[a] > vs[a] ?
                            (-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
                            tp[a],
                        -vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
                            (-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
                            (tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
                    ];
                }
                drawPicker(pp[a], pp[b]);
            }
        };


        this.importColor = function() {
            if(!valueElement) {
                this.exportColor();
            } else {
                if(!this.adjust) {
                    if(!this.fromString(valueElement.value, leaveValue)) {
                        styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
                        styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
                        styleElement.style.color = styleElement.jscStyle.color;
                        this.exportColor(leaveValue | leaveStyle);
                    }
                } else if(!this.required && /^\s*$/.test(valueElement.value)) {
                    valueElement.value = '';
                    styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
                    styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
                    styleElement.style.color = styleElement.jscStyle.color;
                    this.exportColor(leaveValue | leaveStyle);

                } else if(this.fromString(valueElement.value)) {
                    // OK
                } else {
                    this.exportColor();
                }
            }
        };


        this.exportColor = function(flags) {
            var bmakeOnblur = true;
            if(!(flags & leaveValue) && valueElement) {
                var value = this.toString();
                if(this.caps) { value = value.toUpperCase(); }
                if(this.hash) { value = '#'+value; }
                valueElement.value = value;
            }
            else
            bmakeOnblur = false;

            if(!(flags & leaveStyle) && styleElement) {
                styleElement.style.backgroundImage = "none";
                styleElement.style.backgroundColor =
                    '#'+this.toString();
                styleElement.style.color =
                    0.213 * this.rgb[0] +
                    0.715 * this.rgb[1] +
                    0.072 * this.rgb[2]
                    < 0.5 ? '#FFF' : '#000';
            }
            else
                bmakeOnblur = false;

            if(!(flags & leavePad) && isPickerOwner()) {
                redrawPad();
            }
            else
                bmakeOnblur = false;

            if(!(flags & leaveSld) && isPickerOwner()) {
                redrawSld();
            }
            else
                bmakeOnblur = false;

            if(bmakeOnblur == true){
                var save = document.activeElement;
                this.valueElement.focus();
                this.valueElement.blur();
                save.focus();
            }
        };

        this.fromHSV = function(h, s, v, flags) { // null = don't change
            if(h !== null) { h = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, h)); }
            if(s !== null) { s = Math.max(0.0, this.minS, Math.min(1.0, this.maxS, s)); }
            if(v !== null) { v = Math.max(0.0, this.minV, Math.min(1.0, this.maxV, v)); }

            this.rgb = HSV_RGB(
                h===null ? this.hsv[0] : (this.hsv[0]=h),
                s===null ? this.hsv[1] : (this.hsv[1]=s),
                v===null ? this.hsv[2] : (this.hsv[2]=v)
            );

            this.exportColor(flags);
        };


        this.fromRGB = function(r, g, b, flags) { // null = don't change
            if(r !== null) { r = Math.max(0.0, Math.min(1.0, r)); }
            if(g !== null) { g = Math.max(0.0, Math.min(1.0, g)); }
            if(b !== null) { b = Math.max(0.0, Math.min(1.0, b)); }

            var hsv = RGB_HSV(
                r===null ? this.rgb[0] : r,
                g===null ? this.rgb[1] : g,
                b===null ? this.rgb[2] : b
            );
            if(hsv[0] !== null) {
                this.hsv[0] = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, hsv[0]));
            }
            if(hsv[2] !== 0) {
                this.hsv[1] = hsv[1]===null ? null : Math.max(0.0, this.minS, Math.min(1.0, this.maxS, hsv[1]));
            }
            this.hsv[2] = hsv[2]===null ? null : Math.max(0.0, this.minV, Math.min(1.0, this.maxV, hsv[2]));

            // update RGB according to final HSV, as some values might be trimmed
            var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
            this.rgb[0] = rgb[0];
            this.rgb[1] = rgb[1];
            this.rgb[2] = rgb[2];

            this.exportColor(flags);
        };


        this.fromString = function(hex, flags) {
            var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
            if(!m) {
                return false;
            } else {
                if(m[1].length === 6) { // 6-char notation
                    this.fromRGB(
                        parseInt(m[1].substr(0,2),16) / 255,
                        parseInt(m[1].substr(2,2),16) / 255,
                        parseInt(m[1].substr(4,2),16) / 255,
                        flags
                    );
                } else { // 3-char notation
                    this.fromRGB(
                        parseInt(m[1].charAt(0)+m[1].charAt(0),16) / 255,
                        parseInt(m[1].charAt(1)+m[1].charAt(1),16) / 255,
                        parseInt(m[1].charAt(2)+m[1].charAt(2),16) / 255,
                        flags
                    );
                }
                return true;
            }
        };


        this.toString = function() {
            return (
            (0x100 | Math.round(255*this.rgb[0])).toString(16).substr(1) +
            (0x100 | Math.round(255*this.rgb[1])).toString(16).substr(1) +
            (0x100 | Math.round(255*this.rgb[2])).toString(16).substr(1)
            );
        };


        function RGB_HSV(r, g, b) {
            var n = Math.min(Math.min(r,g),b);
            var v = Math.max(Math.max(r,g),b);
            var m = v - n;
            if(m === 0) { return [ null, 0, v ]; }
            var h = r===n ? 3+(b-g)/m : (g===n ? 5+(r-b)/m : 1+(g-r)/m);
            return [ h===6?0:h, m/v, v ];
        }


        function HSV_RGB(h, s, v) {
            if(h === null) { return [ v, v, v ]; }
            var i = Math.floor(h);
            var f = i%2 ? h-i : 1-(h-i);
            var m = v * (1 - s);
            var n = v * (1 - s*f);
            switch(i) {
                case 6:
                case 0: return [v,n,m];
                case 1: return [n,v,m];
                case 2: return [m,v,n];
                case 3: return [m,n,v];
                case 4: return [n,m,v];
                case 5: return [v,m,n];
            }
        }


        function removePicker() {
            delete jscolor.picker.owner;
            document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB);
        }


        function drawPicker(x, y) {
            if(!jscolor.picker) {
                jscolor.picker = {
                    box : document.createElement('div'),
                    boxB : document.createElement('div'),
                    pad : document.createElement('div'),
                    padB : document.createElement('div'),
                    padM : document.createElement('div'),
                    sld : document.createElement('div'),
                    sldB : document.createElement('div'),
                    sldM : document.createElement('div'),
                    btn : document.createElement('div'),
                    btnS : document.createElement('span'),
                    btnT : document.createTextNode(THIS.pickerCloseText)
                };
                for(var i=0,segSize=4; i<jscolor.images.sld[1]; i+=segSize) {
                    var seg = document.createElement('div');
                    seg.style.height = segSize+'px';
                    seg.style.fontSize = '1px';
                    seg.style.lineHeight = '0';
                    jscolor.picker.sld.appendChild(seg);
                }
                jscolor.picker.sldB.appendChild(jscolor.picker.sld);
                jscolor.picker.box.appendChild(jscolor.picker.sldB);
                jscolor.picker.box.appendChild(jscolor.picker.sldM);
                jscolor.picker.padB.appendChild(jscolor.picker.pad);
                jscolor.picker.box.appendChild(jscolor.picker.padB);
                jscolor.picker.box.appendChild(jscolor.picker.padM);
                jscolor.picker.btnS.appendChild(jscolor.picker.btnT);
                jscolor.picker.btn.appendChild(jscolor.picker.btnS);
                jscolor.picker.box.appendChild(jscolor.picker.btn);
                jscolor.picker.boxB.appendChild(jscolor.picker.box);
            }

            var p = jscolor.picker;

            // controls interaction
            p.box.onmouseup =
                p.box.onmouseout = function() { target.focus(); };
            p.box.onmousedown = function() { abortBlur=true; };
            p.box.onmousemove = function(e) {
                if (holdPad || holdSld) {
                    holdPad && setPad(e);
                    holdSld && setSld(e);
                    if (document.selection) {
                        document.selection.empty();
                    } else if (window.getSelection) {
                        window.getSelection().removeAllRanges();
                    }
                    dispatchImmediateChange();
                }
            };
            if('ontouchstart' in window) { // if touch device
                var handle_touchmove = function(e) {
                    var event={
                        'offsetX': e.touches[0].pageX-touchOffset.X,
                        'offsetY': e.touches[0].pageY-touchOffset.Y
                    };
                    if (holdPad || holdSld) {
                        holdPad && setPad(event);
                        holdSld && setSld(event);
                        dispatchImmediateChange();
                    }
                    e.stopPropagation(); // prevent move "view" on broswer
                    e.preventDefault(); // prevent Default - Android Fix (else android generated only 1-2 touchmove events)
                };
                p.box.removeEventListener('touchmove', handle_touchmove, false)
                p.box.addEventListener('touchmove', handle_touchmove, false)
            }
            p.padM.onmouseup =
                p.padM.onmouseout = function() { if(holdPad) { holdPad=false; jscolor.fireEvent(valueElement,'change'); } };
            p.padM.onmousedown = function(e) {
                // if the slider is at the bottom, move it up
                switch(modeID) {
                    case 0: if (THIS.hsv[2] === 0) { THIS.fromHSV(null, null, 1.0); }; break;
                    case 1: if (THIS.hsv[1] === 0) { THIS.fromHSV(null, 1.0, null); }; break;
                }
                holdSld=false;
                holdPad=true;
                setPad(e);
                dispatchImmediateChange();
            };
            if('ontouchstart' in window) {
                p.padM.addEventListener('touchstart', function(e) {
                    touchOffset={
                        'X': e.target.offsetParent.offsetLeft,
                        'Y': e.target.offsetParent.offsetTop
                    };
                    this.onmousedown({
                        'offsetX':e.touches[0].pageX-touchOffset.X,
                        'offsetY':e.touches[0].pageY-touchOffset.Y
                    });
                });
            }
            p.sldM.onmouseup =
                p.sldM.onmouseout = function() { if(holdSld) { holdSld=false; jscolor.fireEvent(valueElement,'change'); } };
            p.sldM.onmousedown = function(e) {
                holdPad=false;
                holdSld=true;
                setSld(e);
                dispatchImmediateChange();
            };
            if('ontouchstart' in window) {
                p.sldM.addEventListener('touchstart', function(e) {
                    touchOffset={
                        'X': e.target.offsetParent.offsetLeft,
                        'Y': e.target.offsetParent.offsetTop
                    };
                    this.onmousedown({
                        'offsetX':e.touches[0].pageX-touchOffset.X,
                        'offsetY':e.touches[0].pageY-touchOffset.Y
                    });
                });
            }

            // picker
            var dims = getPickerDims(THIS);
            p.box.style.width = dims[0] + 'px';
            p.box.style.height = dims[1] + 'px';

            // picker border
            p.boxB.style.position = 'absolute';
            p.boxB.style.clear = 'both';
            p.boxB.style.left = x+'px';
            p.boxB.style.top = y+'px';
            p.boxB.style.zIndex = THIS.pickerZIndex;
            p.boxB.style.border = THIS.pickerBorder+'px solid';
            p.boxB.style.borderColor = THIS.pickerBorderColor;
            p.boxB.style.background = THIS.pickerFaceColor;

            // pad image
            p.pad.style.width = jscolor.images.pad[0]+'px';
            p.pad.style.height = jscolor.images.pad[1]+'px';

            // pad border
            p.padB.style.position = 'absolute';
            p.padB.style.left = THIS.pickerFace+'px';
            p.padB.style.top = THIS.pickerFace+'px';
            p.padB.style.border = THIS.pickerInset+'px solid';
            p.padB.style.borderColor = THIS.pickerInsetColor;

            // pad mouse area
            p.padM.style.position = 'absolute';
            p.padM.style.left = '0';
            p.padM.style.top = '0';
            p.padM.style.width = THIS.pickerFace + 2*THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
            p.padM.style.height = p.box.style.height;
            p.padM.style.cursor = 'crosshair';

            // slider image
            p.sld.style.overflow = 'hidden';
            p.sld.style.width = jscolor.images.sld[0]+'px';
            p.sld.style.height = jscolor.images.sld[1]+'px';

            // slider border
            p.sldB.style.display = THIS.slider ? 'block' : 'none';
            p.sldB.style.position = 'absolute';
            p.sldB.style.right = THIS.pickerFace+'px';
            p.sldB.style.top = THIS.pickerFace+'px';
            p.sldB.style.border = THIS.pickerInset+'px solid';
            p.sldB.style.borderColor = THIS.pickerInsetColor;

            // slider mouse area
            p.sldM.style.display = THIS.slider ? 'block' : 'none';
            p.sldM.style.position = 'absolute';
            p.sldM.style.right = '0';
            p.sldM.style.top = '0';
            p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2*THIS.pickerInset + 'px';
            p.sldM.style.height = p.box.style.height;
            try {
                p.sldM.style.cursor = 'pointer';
            } catch(eOldIE) {
                p.sldM.style.cursor = 'hand';
            }

            // "close" button
            function setBtnBorder() {
                var insetColors = THIS.pickerInsetColor.split(/\s+/);
                var pickerOutsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
                p.btn.style.borderColor = pickerOutsetColor;
            }
            p.btn.style.display = THIS.pickerClosable ? 'block' : 'none';
            p.btn.style.position = 'absolute';
            p.btn.style.left = THIS.pickerFace + 'px';
            p.btn.style.bottom = THIS.pickerFace + 'px';
            p.btn.style.padding = '0 15px';
            p.btn.style.height = '18px';
            p.btn.style.border = THIS.pickerInset + 'px solid';
            setBtnBorder();
            p.btn.style.color = THIS.pickerButtonColor;
            p.btn.style.font = '12px sans-serif';
            p.btn.style.textAlign = 'center';
            try {
                p.btn.style.cursor = 'pointer';
            } catch(eOldIE) {
                p.btn.style.cursor = 'hand';
            }
            p.btn.onmousedown = function () {
                THIS.hidePicker();
            };
            p.btnS.style.lineHeight = p.btn.style.height;

            // load images in optimal order
            switch(modeID) {
                case 0: var padImg = 'hs.png'; break;
                case 1: var padImg = 'hv.png'; break;
            }
            p.padM.style.backgroundImage = "url('"+jscolor.getDir()+"cross.gif')";
            p.padM.style.backgroundRepeat = "no-repeat";
            p.sldM.style.backgroundImage = "url('"+jscolor.getDir()+"arrow.gif')";
            p.sldM.style.backgroundRepeat = "no-repeat";
            p.pad.style.backgroundImage = "url('"+jscolor.getDir()+padImg+"')";
            p.pad.style.backgroundRepeat = "no-repeat";
            p.pad.style.backgroundPosition = "0 0";

            // place pointers
            redrawPad();
            redrawSld();

            jscolor.picker.owner = THIS;
            document.getElementsByTagName('body')[0].appendChild(p.boxB);
        }


        function getPickerDims(o) {
            var dims = [
                2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[0] +
                (o.slider ? 2*o.pickerInset + 2*jscolor.images.arrow[0] + jscolor.images.sld[0] : 0),
                o.pickerClosable ?
                4*o.pickerInset + 3*o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight :
                2*o.pickerInset + 2*o.pickerFace + jscolor.images.pad[1]
            ];
            return dims;
        }


        function redrawPad() {
            // redraw the pad pointer
            switch(modeID) {
                case 0: var yComponent = 1; break;
                case 1: var yComponent = 2; break;
            }
            var x = Math.round((THIS.hsv[0]/6) * (jscolor.images.pad[0]-1));
            var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.pad[1]-1));
            jscolor.picker.padM.style.backgroundPosition =
                (THIS.pickerFace+THIS.pickerInset+x - Math.floor(jscolor.images.cross[0]/2)) + 'px ' +
                (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.cross[1]/2)) + 'px';

            // redraw the slider image
            var seg = jscolor.picker.sld.childNodes;

            switch(modeID) {
                case 0:
                    var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
                    for(var i=0; i<seg.length; i+=1) {
                        seg[i].style.backgroundColor = 'rgb('+
                        (rgb[0]*(1-i/seg.length)*100)+'%,'+
                        (rgb[1]*(1-i/seg.length)*100)+'%,'+
                        (rgb[2]*(1-i/seg.length)*100)+'%)';
                    }
                    break;
                case 1:
                    var rgb, s, c = [ THIS.hsv[2], 0, 0 ];
                    var i = Math.floor(THIS.hsv[0]);
                    var f = i%2 ? THIS.hsv[0]-i : 1-(THIS.hsv[0]-i);
                    switch(i) {
                        case 6:
                        case 0: rgb=[0,1,2]; break;
                        case 1: rgb=[1,0,2]; break;
                        case 2: rgb=[2,0,1]; break;
                        case 3: rgb=[2,1,0]; break;
                        case 4: rgb=[1,2,0]; break;
                        case 5: rgb=[0,2,1]; break;
                    }
                    for(var i=0; i<seg.length; i+=1) {
                        s = 1 - 1/(seg.length-1)*i;
                        c[1] = c[0] * (1 - s*f);
                        c[2] = c[0] * (1 - s);
                        seg[i].style.backgroundColor = 'rgb('+
                        (c[rgb[0]]*100)+'%,'+
                        (c[rgb[1]]*100)+'%,'+
                        (c[rgb[2]]*100)+'%)';
                    }
                    break;
            }
        }


        function redrawSld() {
            // redraw the slider pointer
            switch(modeID) {
                case 0: var yComponent = 2; break;
                case 1: var yComponent = 1; break;
            }
            var y = Math.round((1-THIS.hsv[yComponent]) * (jscolor.images.sld[1]-1));
            jscolor.picker.sldM.style.backgroundPosition =
                '0 ' + (THIS.pickerFace+THIS.pickerInset+y - Math.floor(jscolor.images.arrow[1]/2)) + 'px';
        }


        function isPickerOwner() {
            return jscolor.picker && jscolor.picker.owner === THIS;
        }


        function blurTarget() {
            if(valueElement === target) {
                THIS.importColor();
            }
            if(THIS.pickerOnfocus) {
                THIS.hidePicker();
            }
        }


        function blurValue() {
            if(valueElement !== target) {
                THIS.importColor();
            }
        }


        function setPad(e) {
            var mpos = jscolor.getRelMousePos(e);
            var x = mpos.x - THIS.pickerFace - THIS.pickerInset;
            var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
            switch(modeID) {
                case 0: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), 1 - y/(jscolor.images.pad[1]-1), null, leaveSld); break;
                case 1: THIS.fromHSV(x*(6/(jscolor.images.pad[0]-1)), null, 1 - y/(jscolor.images.pad[1]-1), leaveSld); break;
            }
        }


        function setSld(e) {
            var mpos = jscolor.getRelMousePos(e);
            var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
            switch(modeID) {
                case 0: THIS.fromHSV(null, null, 1 - y/(jscolor.images.sld[1]-1), leavePad); break;
                case 1: THIS.fromHSV(null, 1 - y/(jscolor.images.sld[1]-1), null, leavePad); break;
            }
        }


        function dispatchImmediateChange() {
            if (THIS.onImmediateChange) {
                var callback;
                if (typeof THIS.onImmediateChange === 'string') {
                    callback = new Function (THIS.onImmediateChange);
                } else {
                    callback = THIS.onImmediateChange;
                }
                callback.call(THIS);
            }
        }


        var THIS = this;
        var modeID = this.pickerMode.toLowerCase()==='hvs' ? 1 : 0;
        var abortBlur = false;
        var
            valueElement = jscolor.fetchElement(this.valueElement),
            styleElement = jscolor.fetchElement(this.styleElement);
        var
            holdPad = false,
            holdSld = false,
            touchOffset = {};
        var
            leaveValue = 1<<0,
            leaveStyle = 1<<1,
            leavePad = 1<<2,
            leaveSld = 1<<3;

        jscolor.isColorAttrSupported = false;
        var el = document.createElement('input');
        if(el.setAttribute) {
            el.setAttribute('type', 'color');
            if(el.type.toLowerCase() == 'color') {
                jscolor.isColorAttrSupported = true;
            }
        }

        // target
        jscolor.addEvent(target, 'focus', function() {
            if(THIS.pickerOnfocus) { THIS.showPicker(); }
        });
        jscolor.addEvent(target, 'blur', function() {
            if(!abortBlur) {
                window.setTimeout(function(){ abortBlur || blurTarget(); abortBlur=false; }, 0);
            } else {
                abortBlur = false;
            }
        });

        // valueElement
        if(valueElement) {
            var updateField = function() {
                THIS.fromString(valueElement.value, leaveValue);
                dispatchImmediateChange();
            };
            jscolor.addEvent(valueElement, 'keyup', updateField);
            jscolor.addEvent(valueElement, 'input', updateField);
            jscolor.addEvent(valueElement, 'blur', blurValue);
            valueElement.setAttribute('autocomplete', 'off');
        }

        // styleElement
        if(styleElement) {
            styleElement.jscStyle = {
                backgroundImage : styleElement.style.backgroundImage,
                backgroundColor : styleElement.style.backgroundColor,
                color : styleElement.style.color
            };
        }

        // require images
        switch(modeID) {
            case 0: jscolor.requireImage('hs.png'); break;
            case 1: jscolor.requireImage('hv.png'); break;
        }
        jscolor.requireImage('cross.gif');
        jscolor.requireImage('arrow.gif');

        this.importColor();
    }

};



/*!
 * Jasny Bootstrap v3.1.3 (http://jasny.github.io/bootstrap)
 * Copyright 2012-2014 Arnold Daniels
 * Licensed under Apache-2.0 (https://github.com/jasny/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Jasny Bootstrap's JavaScript requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}void 0===a.support.transition&&(a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()}))}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.state=null,this.placement=null,this.options.recalc&&(this.calcClone(),a(window).on("resize",a.proxy(this.recalc,this))),this.options.autohide&&a(document).on("click",a.proxy(this.autohide,this)),this.options.toggle&&this.toggle(),this.options.disablescrolling&&(this.options.disableScrolling=this.options.disablescrolling,delete this.options.disablescrolling)};b.DEFAULTS={toggle:!0,placement:"auto",autohide:!0,recalc:!0,disableScrolling:!0},b.prototype.offset=function(){switch(this.placement){case"left":case"right":return this.$element.outerWidth();case"top":case"bottom":return this.$element.outerHeight()}},b.prototype.calcPlacement=function(){function b(a,b){if("auto"===e.css(b))return a;if("auto"===e.css(a))return b;var c=parseInt(e.css(a),10),d=parseInt(e.css(b),10);return c>d?b:a}if("auto"!==this.options.placement)return void(this.placement=this.options.placement);this.$element.hasClass("in")||this.$element.css("visiblity","hidden !important").addClass("in");var c=a(window).width()/this.$element.width(),d=a(window).height()/this.$element.height(),e=this.$element;this.placement=c>=d?b("left","right"):b("top","bottom"),"hidden !important"===this.$element.css("visibility")&&this.$element.removeClass("in").css("visiblity","")},b.prototype.opposite=function(a){switch(a){case"top":return"bottom";case"left":return"right";case"bottom":return"top";case"right":return"left"}},b.prototype.getCanvasElements=function(){var b=this.options.canvas?a(this.options.canvas):this.$element,c=b.find("*").filter(function(){return"fixed"===a(this).css("position")}).not(this.options.exclude);return b.add(c)},b.prototype.slide=function(b,c,d){if(!a.support.transition){var e={};return e[this.placement]="+="+c,b.animate(e,350,d)}var f=this.placement,g=this.opposite(f);b.each(function(){"auto"!==a(this).css(f)&&a(this).css(f,(parseInt(a(this).css(f),10)||0)+c),"auto"!==a(this).css(g)&&a(this).css(g,(parseInt(a(this).css(g),10)||0)-c)}),this.$element.one(a.support.transition.end,d).emulateTransitionEnd(350)},b.prototype.disableScrolling=function(){var b=a("body").width(),c="padding-"+this.opposite(this.placement);if(void 0===a("body").data("offcanvas-style")&&a("body").data("offcanvas-style",a("body").attr("style")||""),a("body").css("overflow","hidden"),a("body").width()>b){var d=parseInt(a("body").css(c),10)+a("body").width()-b;setTimeout(function(){a("body").css(c,d)},1)}},b.prototype.show=function(){if(!this.state){var b=a.Event("show.bs.offcanvas");if(this.$element.trigger(b),!b.isDefaultPrevented()){this.state="slide-in",this.calcPlacement();var c=this.getCanvasElements(),d=this.placement,e=this.opposite(d),f=this.offset();-1!==c.index(this.$element)&&(a(this.$element).data("offcanvas-style",a(this.$element).attr("style")||""),this.$element.css(d,-1*f),this.$element.css(d)),c.addClass("canvas-sliding").each(function(){void 0===a(this).data("offcanvas-style")&&a(this).data("offcanvas-style",a(this).attr("style")||""),"static"===a(this).css("position")&&a(this).css("position","relative"),"auto"!==a(this).css(d)&&"0px"!==a(this).css(d)||"auto"!==a(this).css(e)&&"0px"!==a(this).css(e)||a(this).css(d,0)}),this.options.disableScrolling&&this.disableScrolling();var g=function(){"slide-in"==this.state&&(this.state="slid",c.removeClass("canvas-sliding").addClass("canvas-slid"),this.$element.trigger("shown.bs.offcanvas"))};setTimeout(a.proxy(function(){this.$element.addClass("in"),this.slide(c,f,a.proxy(g,this))},this),1)}}},b.prototype.hide=function(){if("slid"===this.state){var b=a.Event("hide.bs.offcanvas");if(this.$element.trigger(b),!b.isDefaultPrevented()){this.state="slide-out";var c=a(".canvas-slid"),d=(this.placement,-1*this.offset()),e=function(){"slide-out"==this.state&&(this.state=null,this.placement=null,this.$element.removeClass("in"),c.removeClass("canvas-sliding"),c.add(this.$element).add("body").each(function(){a(this).attr("style",a(this).data("offcanvas-style")).removeData("offcanvas-style")}),this.$element.trigger("hidden.bs.offcanvas"))};c.removeClass("canvas-slid").addClass("canvas-sliding"),setTimeout(a.proxy(function(){this.slide(c,d,a.proxy(e,this))},this),1)}}},b.prototype.toggle=function(){"slide-in"!==this.state&&"slide-out"!==this.state&&this["slid"===this.state?"hide":"show"]()},b.prototype.calcClone=function(){this.$calcClone=this.$element.clone().html("").addClass("offcanvas-clone").removeClass("in").appendTo(a("body"))},b.prototype.recalc=function(){if("none"!==this.$calcClone.css("display")&&("slid"===this.state||"slide-in"===this.state)){this.state=null,this.placement=null;var b=this.getCanvasElements();this.$element.removeClass("in"),b.removeClass("canvas-slid"),b.add(this.$element).add("body").each(function(){a(this).attr("style",a(this).data("offcanvas-style")).removeData("offcanvas-style")})}},b.prototype.autohide=function(b){0===a(b.target).closest(this.$element).length&&this.hide()};var c=a.fn.offcanvas;a.fn.offcanvas=function(c){return this.each(function(){var d=a(this),e=d.data("bs.offcanvas"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);e||d.data("bs.offcanvas",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.offcanvas.Constructor=b,a.fn.offcanvas.noConflict=function(){return a.fn.offcanvas=c,this},a(document).on("click.bs.offcanvas.data-api","[data-toggle=offcanvas]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.offcanvas"),h=g?"toggle":d.data();b.stopPropagation(),g?g.toggle():f.offcanvas(h)})}(window.jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.$element.on("click.bs.rowlink","td:not(.rowlink-skip)",a.proxy(this.click,this))};b.DEFAULTS={target:"a"},b.prototype.click=function(b){var c=a(b.currentTarget).closest("tr").find(this.options.target)[0];if(a(b.target)[0]!==c)if(b.preventDefault(),c.click)c.click();else if(document.createEvent){var d=document.createEvent("MouseEvents");d.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),c.dispatchEvent(d)}};var c=a.fn.rowlink;a.fn.rowlink=function(c){return this.each(function(){var d=a(this),e=d.data("bs.rowlink");e||d.data("bs.rowlink",e=new b(this,c))})},a.fn.rowlink.Constructor=b,a.fn.rowlink.noConflict=function(){return a.fn.rowlink=c,this},a(document).on("click.bs.rowlink.data-api",'[data-link="row"]',function(b){if(0===a(b.target).closest(".rowlink-skip").length){var c=a(this);c.data("bs.rowlink")||(c.rowlink(c.data()),a(b.target).trigger("click.bs.rowlink"))}})}(window.jQuery),+function(a){"use strict";var b=void 0!==window.orientation,c=navigator.userAgent.toLowerCase().indexOf("android")>-1,d="Microsoft Internet Explorer"==window.navigator.appName,e=function(b,d){c||(this.$element=a(b),this.options=a.extend({},e.DEFAULTS,d),this.mask=String(this.options.mask),this.init(),this.listen(),this.checkVal())};e.DEFAULTS={mask:"",placeholder:"_",definitions:{9:"[0-9]",a:"[A-Za-z]",w:"[A-Za-z0-9]","*":"."}},e.prototype.init=function(){var b=this.options.definitions,c=this.mask.length;this.tests=[],this.partialPosition=this.mask.length,this.firstNonMaskPos=null,a.each(this.mask.split(""),a.proxy(function(a,d){"?"==d?(c--,this.partialPosition=a):b[d]?(this.tests.push(new RegExp(b[d])),null===this.firstNonMaskPos&&(this.firstNonMaskPos=this.tests.length-1)):this.tests.push(null)},this)),this.buffer=a.map(this.mask.split(""),a.proxy(function(a){return"?"!=a?b[a]?this.options.placeholder:a:void 0},this)),this.focusText=this.$element.val(),this.$element.data("rawMaskFn",a.proxy(function(){return a.map(this.buffer,function(a,b){return this.tests[b]&&a!=this.options.placeholder?a:null}).join("")},this))},e.prototype.listen=function(){if(!this.$element.attr("readonly")){var b=(d?"paste":"input")+".mask";this.$element.on("unmask.bs.inputmask",a.proxy(this.unmask,this)).on("focus.bs.inputmask",a.proxy(this.focusEvent,this)).on("blur.bs.inputmask",a.proxy(this.blurEvent,this)).on("keydown.bs.inputmask",a.proxy(this.keydownEvent,this)).on("keypress.bs.inputmask",a.proxy(this.keypressEvent,this)).on(b,a.proxy(this.pasteEvent,this))}},e.prototype.caret=function(a,b){if(0!==this.$element.length){if("number"==typeof a)return b="number"==typeof b?b:a,this.$element.each(function(){if(this.setSelectionRange)this.setSelectionRange(a,b);else if(this.createTextRange){var c=this.createTextRange();c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select()}});if(this.$element[0].setSelectionRange)a=this.$element[0].selectionStart,b=this.$element[0].selectionEnd;else if(document.selection&&document.selection.createRange){var c=document.selection.createRange();a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length}return{begin:a,end:b}}},e.prototype.seekNext=function(a){for(var b=this.mask.length;++a<=b&&!this.tests[a];);return a},e.prototype.seekPrev=function(a){for(;--a>=0&&!this.tests[a];);return a},e.prototype.shiftL=function(a,b){var c=this.mask.length;if(!(0>a)){for(var d=a,e=this.seekNext(b);c>d;d++)if(this.tests[d]){if(!(c>e&&this.tests[d].test(this.buffer[e])))break;this.buffer[d]=this.buffer[e],this.buffer[e]=this.options.placeholder,e=this.seekNext(e)}this.writeBuffer(),this.caret(Math.max(this.firstNonMaskPos,a))}},e.prototype.shiftR=function(a){for(var b=this.mask.length,c=a,d=this.options.placeholder;b>c;c++)if(this.tests[c]){var e=this.seekNext(c),f=this.buffer[c];if(this.buffer[c]=d,!(b>e&&this.tests[e].test(f)))break;d=f}},e.prototype.unmask=function(){this.$element.unbind(".mask").removeData("inputmask")},e.prototype.focusEvent=function(){this.focusText=this.$element.val();var a=this.mask.length,b=this.checkVal();this.writeBuffer();var c=this,d=function(){b==a?c.caret(0,b):c.caret(b)};d(),setTimeout(d,50)},e.prototype.blurEvent=function(){this.checkVal(),this.$element.val()!==this.focusText&&this.$element.trigger("change")},e.prototype.keydownEvent=function(a){var c=a.which;if(8==c||46==c||b&&127==c){var d=this.caret(),e=d.begin,f=d.end;return f-e===0&&(e=46!=c?this.seekPrev(e):f=this.seekNext(e-1),f=46==c?this.seekNext(f):f),this.clearBuffer(e,f),this.shiftL(e,f-1),!1}return 27==c?(this.$element.val(this.focusText),this.caret(0,this.checkVal()),!1):void 0},e.prototype.keypressEvent=function(a){var b=this.mask.length,c=a.which,d=this.caret();if(a.ctrlKey||a.altKey||a.metaKey||32>c)return!0;if(c){d.end-d.begin!==0&&(this.clearBuffer(d.begin,d.end),this.shiftL(d.begin,d.end-1));var e=this.seekNext(d.begin-1);if(b>e){var f=String.fromCharCode(c);if(this.tests[e].test(f)){this.shiftR(e),this.buffer[e]=f,this.writeBuffer();var g=this.seekNext(e);this.caret(g)}}return!1}},e.prototype.pasteEvent=function(){var a=this;setTimeout(function(){a.caret(a.checkVal(!0))},0)},e.prototype.clearBuffer=function(a,b){for(var c=this.mask.length,d=a;b>d&&c>d;d++)this.tests[d]&&(this.buffer[d]=this.options.placeholder)},e.prototype.writeBuffer=function(){return this.$element.val(this.buffer.join("")).val()},e.prototype.checkVal=function(a){for(var b=this.mask.length,c=this.$element.val(),d=-1,e=0,f=0;b>e;e++)if(this.tests[e]){for(this.buffer[e]=this.options.placeholder;f++<c.length;){var g=c.charAt(f-1);if(this.tests[e].test(g)){this.buffer[e]=g,d=e;break}}if(f>c.length)break}else this.buffer[e]==c.charAt(f)&&e!=this.partialPosition&&(f++,d=e);return!a&&d+1<this.partialPosition?(this.$element.val(""),this.clearBuffer(0,b)):(a||d+1>=this.partialPosition)&&(this.writeBuffer(),a||this.$element.val(this.$element.val().substring(0,d+1))),this.partialPosition?e:this.firstNonMaskPos};var f=a.fn.inputmask;a.fn.inputmask=function(b){return this.each(function(){var c=a(this),d=c.data("bs.inputmask");d||c.data("bs.inputmask",d=new e(this,b))})},a.fn.inputmask.Constructor=e,a.fn.inputmask.noConflict=function(){return a.fn.inputmask=f,this},a(document).on("focus.bs.inputmask.data-api","[data-mask]",function(){var b=a(this);b.data("bs.inputmask")||b.inputmask(b.data())})}(window.jQuery),+function(a){"use strict";var b="Microsoft Internet Explorer"==window.navigator.appName,c=function(b,c){if(this.$element=a(b),this.$input=this.$element.find(":file"),0!==this.$input.length){this.name=this.$input.attr("name")||c.name,this.$hidden=this.$element.find('input[type=hidden][name="'+this.name+'"]'),0===this.$hidden.length&&(this.$hidden=a('<input type="hidden">').insertBefore(this.$input)),this.$preview=this.$element.find(".fileinput-preview");var d=this.$preview.css("height");"inline"!==this.$preview.css("display")&&"0px"!==d&&"none"!==d&&this.$preview.css("line-height",d),this.original={exists:this.$element.hasClass("fileinput-exists"),preview:this.$preview.html(),hiddenVal:this.$hidden.val()},this.listen()}};c.prototype.listen=function(){this.$input.on("change.bs.fileinput",a.proxy(this.change,this)),a(this.$input[0].form).on("reset.bs.fileinput",a.proxy(this.reset,this)),this.$element.find('[data-trigger="fileinput"]').on("click.bs.fileinput",a.proxy(this.trigger,this)),this.$element.find('[data-dismiss="fileinput"]').on("click.bs.fileinput",a.proxy(this.clear,this))},c.prototype.change=function(b){var c=void 0===b.target.files?b.target&&b.target.value?[{name:b.target.value.replace(/^.+\\/,"")}]:[]:b.target.files;if(b.stopPropagation(),0===c.length)return void this.clear();this.$hidden.val(""),this.$hidden.attr("name",""),this.$input.attr("name",this.name);var d=c[0];if(this.$preview.length>0&&("undefined"!=typeof d.type?d.type.match(/^image\/(gif|png|jpeg)$/):d.name.match(/\.(gif|png|jpe?g)$/i))&&"undefined"!=typeof FileReader){var e=new FileReader,f=this.$preview,g=this.$element;e.onload=function(b){var e=a("<img>");e[0].src=b.target.result,c[0].result=b.target.result,g.find(".fileinput-filename").text(d.name),"none"!=f.css("max-height")&&e.css("max-height",parseInt(f.css("max-height"),10)-parseInt(f.css("padding-top"),10)-parseInt(f.css("padding-bottom"),10)-parseInt(f.css("border-top"),10)-parseInt(f.css("border-bottom"),10)),f.html(e),g.addClass("fileinput-exists").removeClass("fileinput-new"),g.trigger("change.bs.fileinput",c)},e.readAsDataURL(d)}else this.$element.find(".fileinput-filename").text(d.name),this.$preview.text(d.name),this.$element.addClass("fileinput-exists").removeClass("fileinput-new"),this.$element.trigger("change.bs.fileinput")},c.prototype.clear=function(a){if(a&&a.preventDefault(),this.$hidden.val(""),this.$hidden.attr("name",this.name),this.$input.attr("name",""),b){var c=this.$input.clone(!0);this.$input.after(c),this.$input.remove(),this.$input=c}else this.$input.val("");this.$preview.html(""),this.$element.find(".fileinput-filename").text(""),this.$element.addClass("fileinput-new").removeClass("fileinput-exists"),void 0!==a&&(this.$input.trigger("change"),this.$element.trigger("clear.bs.fileinput"))},c.prototype.reset=function(){this.clear(),this.$hidden.val(this.original.hiddenVal),this.$preview.html(this.original.preview),this.$element.find(".fileinput-filename").text(""),this.original.exists?this.$element.addClass("fileinput-exists").removeClass("fileinput-new"):this.$element.addClass("fileinput-new").removeClass("fileinput-exists"),this.$element.trigger("reset.bs.fileinput")},c.prototype.trigger=function(a){this.$input.trigger("click"),a.preventDefault()};var d=a.fn.fileinput;a.fn.fileinput=function(b){return this.each(function(){var d=a(this),e=d.data("bs.fileinput");e||d.data("bs.fileinput",e=new c(this,b)),"string"==typeof b&&e[b]()})},a.fn.fileinput.Constructor=c,a.fn.fileinput.noConflict=function(){return a.fn.fileinput=d,this},a(document).on("click.fileinput.data-api",'[data-provides="fileinput"]',function(b){var c=a(this);if(!c.data("bs.fileinput")){c.fileinput(c.data());var d=a(b.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');d.length>0&&(b.preventDefault(),d.trigger("click.bs.fileinput"))}})}(window.jQuery);
