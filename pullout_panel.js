$.fn.pulloutPanel = function(options) {

    var settings = $.extend({}, $.fn.pulloutPanel.defaults, options);

    once(function() {
        Csster.style({
            '.pullout_panel': {
                position: 'fixed',
                bottom: 0,
                has: [settings.css]
            }
        });
    });

    return $(this).each(function() {
        var $this = $(this);

        if ($this.hasClass('pullout_panel')) return;

        $this.addClass('pullout_panel');

        $this.bind('open', function() {
            $this.animate({bottom: 0}, 'slow', 'easeOutBounce', function() {
                $this.removeClass('closed').addClass('opened');
                $this.trigger('opened');
            });
        });
        $this.bind('close', function() {
            var height = $this.innerHeight();
            $this.animate({bottom: -height + 50}, 'slow', 'easeOutBounce', function() {
                $this.addClass('closed').removeClass('opened');
                $this.trigger('closed');
            });
        });
        $this.bind('toggle', function() {
            $this.trigger($this.hasClass('opened') ? 'close' : 'open');
        });


        $this.trigger(settings.open ? 'open' : 'close');

    });
};


$.fn.pulloutPanel.defaults = {
    attachTo: 'bottom',
    css: {
        left: 0,
        minHeight: 390,
        border: '1px 1px 1px 0 solid #666',
        has: [roundedCorners('tr', 10),boxShadow([0,0], 10, 'red')],
        cursor: 'pointer'
    }
};

