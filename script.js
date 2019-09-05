$(document).ready(function() {
    $.each($('.pixel').toArray(), function(index, pixelComponent) {
        var root = $(pixelComponent);
        root.css("position", "relative");

        var base = root.clone();
        base.css({
            "mix-blend-mode": "darken",
            "will-change": "opacity",
            "pointer-events": "none",
            opacity: 0,
            position: "absolute",
            top: "0px",
            left: "0px"
        });
        base.removeClass("pixel");

        root.find("> *:not(.pixelContent)").css("color","#fff");
        root.append($("<div>").addClass("pixelContent"));

        var yellow  = base.clone();
        var cyan    = base.clone();
        var magenta = base.clone();

        yellow.css("color", "#FFFF00");
        cyan.css("color", "#00FFFF");
        magenta.css("color","#FF00FF");

        yellow.addClass("yellow");
        cyan.addClass("cyan");
        magenta.addClass("magenta");

        var pixelContent = root.find(".pixelContent");
        pixelContent.append(magenta);
        pixelContent.append(yellow);
        pixelContent.append(cyan);

        updatePositions(0, 0);

        updateColors($('.pixel'));
    });

    $("#updateColors").click(function() {
        var pixel = $('.pixel');

        pixel.css("color", $("#updater > input[type=text]").val());

        updateColors(pixel);
    });

    $("body").mousemove(function(event) {
        var mouseX = event.pageX;
        var mouseY = event.pageY;

        updatePositions(mouseX, mouseY);
    });
});

function Colors(colorString) {
    this.rgbColors = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1, 4);

    this.r = this.rgbColors[0] / 255.0;
    this.g = this.rgbColors[1] / 255.0;
    this.b = this.rgbColors[2] / 255.0;

    this.k = 1 - Math.max(this.r, this.g, this.b);
    var cd = (1 - this.r - this.k) / (1 - this.k) || 0;
    var yd = (1 - this.b - this.k) / (1 - this.k) || 0;
    var md = (1 - this.g - this.k) / (1 - this.k) || 0;

    this.c = cd + this.k;
    this.y = yd + this.k;
    this.m = md + this.k;
}

function updateColors(element) {
    var color   = element.css("color");
    var colors  = new Colors(color);

    $(".yellow").animate(
        { "opacity": colors.y },
        500
    );
    $(".cyan").animate(
        { "opacity": colors.c },
        500
    );
    $(".magenta").animate(
        { "opacity": colors.m },
        500
    );
}

function updatePositions(mouseX, mouseY) {
    $.each($(".pixel"), function(_index, pixel) {
        updatePosition(mouseX, mouseY, $(pixel));
    });
}

function updatePosition(mouseX, mouseY, element) {
    element = $(element);

    var scale     = element.attr("pixel-scale") || 1;
    var minRadius = element.attr("pixel-minRadius") || 1;

    var elementX = element.offset().left + (element.width() / 2);
    var elementY = element.offset().top + (element.height() / 2);
    var mouseOffsetX = elementX - mouseX;
    var mouseOffsetY = elementY - mouseY;
    var angleOffset = Math.atan2(mouseOffsetX, mouseOffsetY);

    var distance = Math.sqrt(Math.pow(mouseOffsetX, 2)
                            + Math.pow(mouseOffsetY, 2));
    var pixelRadius = scale * (distance / (distance + 100)) + minRadius;
    
    var yellowPos   = [Math.sin(angleOffset + 360 * 0),
        Math.cos(angleOffset + 360 * 0)];
    var cyanPos     = [Math.sin(angleOffset + 360 * 1),
        Math.cos(angleOffset + 360 * 1)];
    var magentaPos  = [Math.sin(angleOffset + 360 * 2),
        Math.cos(angleOffset + 360 * 2)];

    var yellow  = element.find('.yellow');
    var cyan    = element.find('.cyan');
    var magenta = element.find('.magenta');

    yellow.css({
        top: (yellowPos[1] * pixelRadius) + "px",
        left: (yellowPos[0] * pixelRadius) + "px"
    });
    cyan.css({
        top: (cyanPos[1] * pixelRadius) + "px",
        left: (cyanPos[0] * pixelRadius) + "px"
    });
    magenta.css({
        top: (magentaPos[1] * pixelRadius) + "px",
        left: (magentaPos[0] * pixelRadius) + "px"
    });
}