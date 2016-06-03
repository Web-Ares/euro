var Dishes = function (obj) {

    //private properties
    var _self = this,
        _obj = obj,
        _body = $( 'body' ),
        _content = new Content( _obj ),
        _newProductBtn = _obj.find( '.content__filter-new' ),
        _tableBody = _obj.find( '.table__body' ),
        _contextMenu = _tableBody.find( '.context' ),
        _productId = null,
        _confirmBtn = _contextMenu.find( '.dishes__confirm' ),
        _removeBtn = _contextMenu.find( '.dishes__delete' ),
        _currentRow = null,
        _request = new XMLHttpRequest();

    //private methods
    var _confirmProduct = function () {
            _request.abort();
            _request = $.ajax({
                url: _confirmBtn.attr( 'href' ) + '/' + _productId + '/confirm',
                beforeSend: function( xhr ) { xhr.setRequestHeader( 'X-CSRF-Token', $( 'meta[name="csrf-token"]' ).attr( 'content' ) ) },
                dataType: 'json',
                timeout: 20000,
                type: 'get',
                success: function ( data ) {
                    _currentRow.removeClass( 'table__row_moderateble' );

                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log(XMLHttpRequest.responseText);
                        _container.removeClass( 'loader__loading' );

                    }
                }
            });
        },
        _hideContextMenu = function () {
            _contextMenu.addClass( 'context_hidden' );
            _contextMenu.removeAttr( 'style' );
        },
        _constructor = function () {
            _onEvents();
            _obj[0].productObj = _self;
        },
        _onEvents = function () {
            _confirmBtn.on( {
                click: function () {
                    _hideContextMenu();
                    _confirmProduct();
                    return false;
                }
            } );
            _removeBtn.on( {
                click: function () {
                    _hideContextMenu();
                    _removeProduct();
                    return false;
                }
            } );
            _contextMenu.on( {
                click: function () {
                    return false;
                }
            } );
            _tableBody.on( 'contextmenu', '.table__row', function ( e ) {
                _showContextMenu( $( this ), e );
                return false;
            } );
            _body.on( {
                click: function () {
                    _hideContextMenu();
                }
            } );
            _newProductBtn.on( {
                click: function () {
                    history.pushState({},'', location.origin + $( this ).data('action'));
                    $( '.dashboard' )[0].obj.route();
                    return false;
                }
            } );
        },
        _removeProduct = function () {
            _request = $.ajax({
                url: _removeBtn.attr( 'href' ) + '/' + _productId,
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                dataType: 'json',
                timeout: 20000,
                data: { _method: 'DELETE' },
                type: 'post',
                success: function () {
                    _currentRow.remove();

                    if( _tableBody.scrollTop() > _tableBody.find('>div:first-child').height() - _tableBody.height() ){
                        _tableBody.scrollTop( _tableBody.find('>div:first-child').height() - _tableBody.height() );
                    }
                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log('err');
                    }
                }
            });
        },
        _showContextMenu = function ( row, e ) {
            var removable = row.hasClass( 'table__row_removable' ),
                moderateble = row.hasClass( 'table__row_moderateble' ),
                tablleBodyLeft = _tableBody.offset().left,
                tablleBodyTop = _tableBody.offset().top,
                scrollTop = _tableBody.scrollTop(),
                contextLeft = null,
                contextTop = null,
                contextBottom = null,
                contextRight = null;

            _contextMenu.removeClass( 'dishes__context_removable' );
            _contextMenu.removeClass( 'dishes__context_moderateble' );


            if( removable || moderateble ){

                _productId = row.data( 'id' );
                _currentRow = row;

                if ( removable ){
                    _contextMenu.addClass( 'dishes__context_removable' );
                }
                if ( moderateble ){
                    _contextMenu.addClass( 'dishes__context_moderateble' );
                }

                contextLeft = e.pageX - tablleBodyLeft;
                contextTop = e.pageY - tablleBodyTop + scrollTop;
                contextBottom = contextTop + _contextMenu.height();
                contextRight = contextLeft + _contextMenu.width();

                _contextMenu.removeClass( 'context_hidden' );

                if ( contextBottom - scrollTop > _tableBody.height() && contextRight > _tableBody.width() ){
                    _contextMenu.css( {
                        top: contextTop - _contextMenu.height(),
                        left: contextLeft - _contextMenu.width()
                    } );
                } else if ( contextBottom - scrollTop > _tableBody.height()){
                    _contextMenu.css( {
                        top: contextTop - _contextMenu.height(),
                        left: contextLeft
                    } );
                } else if(contextRight > _tableBody.width()){
                    _contextMenu.css( {
                        top: contextTop,
                        left: contextLeft - _contextMenu.width()
                    } );
                } else {
                    _contextMenu.css( {
                        top: contextTop,
                        left: contextLeft
                    } );
                }

            }

        };

    //public properties

    _constructor();
};

var NewDish = function ( obj ) {

    //private properties
    var _self = this,
        _obj = obj,
        _container = null,
        _containerWrap = $( '.popup__' + _obj.data( 'popup' ) ),
        _loadUrl = _obj.data( 'action' ),
        _formValidator = null,
        _form = null,
        _request = new XMLHttpRequest();

    //private methods
    var _addForm = function ( html ) {
            _form = $( html );
            _formValidator = new FormValidator( _form );

            _container.append( _form );
            _form.find( 'input' ).eq( 0 ).focus();

            _container.removeClass( 'loader__loading' );

            _form.on( {
                submit: function(){
                    if( _formValidator.checkValid() ){
                        _createProduct();
                    }
                    return false;
                }
            } );
        },
        _constructor = function () {
            _onEvents();
            _obj[0].obj = _self;
        },
        _createProduct = function () {
            _container.addClass( 'loader__loading' );

            _request.abort();
            _request = $.ajax({
                url: _form.attr( 'action' ),
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                data: _form.serialize(),
                dataType: 'json',
                timeout: 20000,
                type: 'post',
                success: function () {
                    $( '.popup' )[0].obj.hide();
                    $( '.dishes' )[0].obj.sortData();
                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log(XMLHttpRequest.responseText);
                        _container.removeClass( 'loader__loading' );

                    }
                }
            });
        },
        _createForm = function () {
            _container = $( '<div class="new-dish loader"></div>' );
            _containerWrap.append( _container );
        },
        _loadFormContent = function () {
            _container.addClass( 'loader__loading' );

            _request.abort();
            _request = $.ajax({
                url: _loadUrl,
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                dataType: 'html',
                timeout: 20000,
                type: 'get',
                success: function ( html ) {
                    _addForm( html );
                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log('err');
                    }
                }
            });
        },
        _onEvents = function () {
            _obj.on( {
                click: function () {
                    _createForm();
                    _loadFormContent();
                }
            } );
        };

    //public properties

    //public methods

    _constructor();
};