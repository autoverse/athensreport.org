$(document).ready(function() {
    'use strict';

    // Fetch items
    var items = {
        getItems: function(data) {
            var url = '/items/' + data.category + '/' + data.timestamp + '/' + data.year + '/';
            var opts = {
                url: url
            };
            return $.ajax(opts, function() {}, function(error) {
                console.error('Error fetching', error);
            });
        },
        getItem: function(data) {
            var url = '/item/' + data.id + '/';
            var opts = {
                url: url
            };
            return $.ajax(opts, function() {}, function(error) {
                console.error('Error fetching', error);
            });
        },
    };

    // Initiate Item details
    $('body').on('itemsloaded', function() {
        $('.details').on('click', function(event) {
            event.preventDefault();
            var source = $('#details-source');
            var info = $('#details-info');
            source.html('<div class="empty-details" id="load">LOADING...</div>');
            info.html('');
            var id = $(this).data('id');
            items.getItem({
                id: id
            }).done(function(item) {
                var source_html = ``;
                var info_html = ``;
                if (item.fields.category == 'Photo') {
                    source_html = `
                        <img id="details-src" src="/media/${item.fields.source}" alt="${item.fields.title}" class="img-responsive">
                    `;
                } else {
                    source_html = `
                        <video id="details-src" controls class="img-responsive">
                          <source src="/media/${item.fields.source}">
                        </video>

                        <div class="video-back" id="video-back">
                            <a href="#"><img src="/static/img/back.png" alt="Back to the Project"></a>
                        </div>
                    `;
                }
                info_html += `<div class="gallery-details-text">`;
                if (item.fields.social_graph) {
                    info_html += `
                        <div class="gallery-cat">
                          <img src="/static/img/social.png" alt="${item.fields.title}">
                        </div>
                    `;
                } else {
                    info_html += `
                        <div class="gallery-cat">
                          <img src="/static/img/riots.png" alt="${item.fields.title}">
                        </div>
                    `;
                }
                info_html += `
                    <div class="gallery-title">${item.fields.title}</div>
                    <div class="gallery-year yellow-dark">
                      ${item.fields.created}
                    </div>
                `;
                if (item.fields.location) {
                    info_html += `
                        <div class="gallery-location">
                          <strong>Location:</strong>
                          ${item.fields.location}
                        </div>
                    `;
                }
                if (item.fields.credit) {
                    info_html += `
                        <div class="gallery-creator">
                          <strong>Creator:</strong>
                          ${item.fields.credit}
                    `;
                    if (item.fields.creator_url) {
                        info_html += `
                              <a href="${item.fields.creator_url}" target="_blank" style="color:black;">
                                <span class="glyphicon glyphicon-link" aria-hidden="true"></span>
                              </a>
                        `;
                    }
                    info_html += `</div>`;
                }
                if (item.fields.comment) {
                    var short_comment = '';
                    comment = item.fields.comment;
                    if ((item.fields.comment).length > 70) {
                        short_comment = (item.fields.comment).substr(1, 70) + ' ...';
                    }
                    info_html += `
                        <div class="gallery-comment">
                          <strong>Description:</strong>
                          <span id="comment">${short_comment}</span>
                        </div>
                    `;

                }
                info_html += `<div class="details-bottom">`;
                if (short_comment) {
                    info_html += `
                        <div class="col-md-4">
                            <a href="#" id="comment-plus"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>
                        </div>
                    `;
                }
                info_html += `
                    <div class="col-md-8 social-share details-social">
                      <img src="/static/img/facebook.png" alf="facebook">
                      <img src="/static/img/twitter.png" alf="twitter">
                      <img src="/static/img/email.png" alf="email">
                    </div></div>
                `;
                info_html += `</div>`;
                source.html(source_html);
                info.html(info_html);
                $('#details-src').resize(function() {
                    var height = $('#details-src').height();
                    $('.gallery-details-text').css('height', height);
                });
                var target = $('#details');
                $('html, body').animate({
                    show: target,
                    scrollTop: $(target).offset().top - 220
                }, 1000);
            });
        });
    });

    // Render gallery
    var render = function(params) {
        var elements = '';

        if (params.length) {
            params.forEach(function(item) {
                var element = `
                  <div class="col-md-6 gallery-item">
                    <a href="#" class="details" data-id="${item.pk}">
                      <img src="/media/${item.fields.source_thumb}" alt="${item.fields.title}" class="gallery-thumb">
                    </a>
                    <p class="details-title">${item.fields.title}</p>
                `;
                if (item.fields.social_graph) {
                    var pubdate = `
                        <p class="details-created social-graph-date yellow-dark">${item.fields.created}</p>
                    `;
                } else {
                    var pubdate = `
                        <p class="details-created yellow-dark">${item.fields.created}</p>
                    `;
                }
                if (item.fields.category == 'Photo') {
                    var cat_icon = `
                          <div class="details-cat-icon">
                            <img src="/static/img/photo.png" alt="photo">
                          </div>
                        </div>
                    `;
                } else {
                    var cat_icon = `
                          <div class="details-cat-icon">
                            <img src="/static/img/video.png" alt="video">
                          </div>
                        </div>
                    `;
                }
                elements += (element + pubdate + cat_icon);
            });
        } else {
            elements = `<p class="empty-gallery">No gallery items on this specific time or year.</p>`;
        }

        var rendered = `${elements}`;

        return rendered;
    };

    var gallery = $('#gallery-items');
    var category = $(gallery).data('category');
    var comment = '';

    // Filter by year
    $('.year-pick').on('click', function(event) {
        event.preventDefault();
        gallery.html('<div class="empty-gallery" id="load">LOADING...</div>');
        currentYear = $(this).data('year');
        $('#years > img').attr('src', '/static/img/years_' + currentYear + '.png');
        items.getItems({
            category: category,
            timestamp: currentTime,
            year: currentYear
        }).done(function(data) {
            gallery.html(render(data));
            $('body').trigger('itemsloaded');
        });
    });

    // Show full comment
    $(document).on('click', '#comment-plus', function(event) {
        event.preventDefault();
        $('#comment').text(comment);
        $('.details-bottom').css('position', 'relative');
    });

    // Back to video
    $(document).on('click', '#video-back', function () {
        $('body, html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // Select all things
    var pop = Popcorn('#thevideo');
    var video = $('#thevideo');
    var route = $('.route');
    var route_title = $('.route-title');
    var elm_gallery = $('#gallery');
    var elm_strip = $('#gallery-strip');
    var elm_back = $('#video-back');
    var elm_detailsSource = $('#details-source');
    var elm_detailsInfo = $('#details-info');

    // Keep the moments
    var currentTime;
    var currentYear = 2008;

    // Catch pause event and send over the current position
    pop.on('pause', function() {
        currentTime = this.currentTime();
        elm_gallery.slideDown();
        elm_strip.slideDown();
        route.hide();
        route_title.hide();
        $('#years > img').attr('src', '/static/img/years_' + currentYear + '.png');
        items.getItems({
            category: category,
            timestamp: currentTime,
            year: currentYear
        }).done(function(data) {
            gallery.html(render(data));
            $('body').trigger('itemsloaded');
        });
    });

    // Hide elements on play
    pop.on('play', function() {
        route.show();
        route_title.show();
        elm_gallery.slideUp();
        elm_strip.slideUp();
        elm_detailsSource.text('');
        elm_detailsInfo.text('');
        elm_back.slideUp();
    });

    // Start the video
    pop.play();

    // Jump on map
    $('.route-pick').on('click', function(event) {
        event.preventDefault();
        var point = $(this).data('point');
        pop.currentTime(point);
        $('body, html').animate({
            scrollTop: 0
        }, 800);
    });

    // Responsive map
    $('img.route-img[usemap]').rwdImageMaps();
});
