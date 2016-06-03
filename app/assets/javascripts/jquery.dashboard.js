( function () {

    $( function () {
        if( $( '.dashboard' ).length ){
            new Dashboard( $( '.dashboard' ) );
        }
    } );

    var Dashboard = function ( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _content = _obj.find( '.dashboard__content' ),
            _menu = _obj.find( '.dashboard__menu' ),
            _menuItems = _menu.find( 'a' ),
            _menuActiveIndex = null,
            _request = new XMLHttpRequest();

        //private methods
        var _addContent = function ( html ) {
                _content.html( html );
                _initContent();

                _content.removeClass( 'loader__loading' );
            },
            _constructor = function () {
                _onEvents();
                _initMenuScroll();
                _menuItems.eq(0).trigger( 'click' );
                _obj[ 0 ].obj = _self;
            },
            _initContent = function () {
                $( '.countries' ).each( function () {
                    new Countries( $( this ) );
                } );
                $( '.schedule' ).each( function () {
                    new Schedules( $( this ) );
                } );
            },
            _initMenuScroll = function () {
                _menu.perfectScrollbar( {
                    suppressScrollX: true
                } );
            },
            _loadContent = function (path) {
                _content.addClass( 'loader__loading' );

                _request.abort();
                _request = $.ajax({
                    url: location.origin + path,
                    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                    dataType: 'html',
                    timeout: 20000,
                    type: 'get',
                    success: function ( data ) {
                        _addContent( data );
                    },
                    error: function (XMLHttpRequest) {
                        if (XMLHttpRequest.statusText != "abort") {
                            console.log('err');
                        }
                    }
                });
            },
            _onEvents = function () {
                _menuItems.on( {
                    click: function () {
                        if(  !$( this ).hasClass('active') ){
                            _menuItems.removeClass('active');

                            $( this ).addClass('active');
                        }

                        _loadContent($( this ).attr( 'href' ));
                        
                        return false;
                    }
                } );
            };

        //public properties

        //public methods
        _self.reload = function () {
            console.log(_menuItems.filter( '.active' ));
            _menuItems.filter( '.active' ).trigger( 'click' );
        };


        _constructor();
    };

} )();

var Countries = function (obj) {

    //private properties
    var _self = this,
        _obj = obj,
        _form = _obj.find( 'form' ),
        _request = new XMLHttpRequest();

    //private methods
    var _constructor = function () {
            _onEvents();
            _obj[0].obj = _self;
        },
        _create = function () {

            _request.abort();
            _request = $.ajax({
                url: _form.attr( 'action' ),
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                data: _form.serialize(),
                dataType: 'json',
                timeout: 20000,
                type: 'post',
                success: function () {
                    _form[0].reset();
                    $( '.dashboard' )[0].obj.reload();

                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log(XMLHttpRequest.responseText);
                        _container.removeClass( 'loader__loading' );

                    }
                }
            });
        },
        _onEvents = function () {
            _form.on( {
                'submit': function () {
                    _create();
                    return false;
                }
            } );
        };

    //public properties

    //public methods

    _constructor();
};
var Schedules = function (obj) {

    //private properties
    var _self = this,
        _obj = obj,
        _form = _obj.find( 'form' ),
        _btns = _obj.find( '.schedule__content button' ),
        _forms = _obj.find( '.schedule__score' ),
        _request = new XMLHttpRequest();

    //private methods
    var _constructor = function () {
            _onEvents();
            _obj[0].obj = _self;
        },
        _create = function () {

            
            console.log(_form.attr( 'action' ));
            _request.abort();
            _request = $.ajax({
                url: _form.attr( 'action' ),
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                data: _form.serialize(),
                dataType: 'json',
                timeout: 20000,
                type: 'post',
                success: function () {
                    _form[0].reset();
                    $( '.dashboard' )[0].obj.reload();

                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log(XMLHttpRequest.responseText);
                        _container.removeClass( 'loader__loading' );

                    }
                }
            });
        },
        _rate = function ( item ) {
            var data = {};

            data.schedule_id = item.parents( '.schedule__item' ).data( 'id' );

            if( item.data( 'id' ) ){
                data.winner = item.data( 'id' );
            } else {
                data.draw = true;
            }

            if( item.data( 'rate' ) ){
                data.id = item.data( 'rate' );
            }

            _request.abort();
            _request = $.ajax({
                url: item.data( 'action' ),
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                data: data,
                dataType: 'json',
                timeout: 20000,
                type: 'post',
                success: function () {
                    $( '.dashboard' )[0].obj.reload();

                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log(XMLHttpRequest.responseText);
                        _container.removeClass( 'loader__loading' );

                    }
                }
            });
        },
        _onEvents = function () {
            _form.on( {
                submit: function () {
                    console.log(1000);
                    _create();
                    return false;
                }
            } );

            _btns.on( {
                click: function () {
                    _rate( $( this ) );
                    return false;
                }
            } );

            _forms.on( {
                submit: function () {
                    _request.abort();
                    _request = $.ajax({
                        url: $( this ).attr( 'action' ),
                        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                        data: $( this ).serialize(),
                        dataType: 'json',
                        timeout: 20000,
                        type: 'get',
                        success: function () {
                            $( '.dashboard' )[0].obj.reload();
                        },
                        error: function (XMLHttpRequest) {
                            if (XMLHttpRequest.statusText != "abort") {
                                console.log(XMLHttpRequest.responseText);
                                _container.removeClass( 'loader__loading' );

                            }
                        }
                    });
                    return false;
                }
            } );
        };

    //public properties

    //public methods

    _constructor();
};


