var Context = function (obj, parent) {

    //private properties
    var _self = this,
        _obj = obj,
        _parent = parent;

    //private methods
    var _constructor = function () {
            _onEvents();
            _obj[0].obj = _self;
        },
        _onEvents = function () {
            
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

            _contextMenu.removeClass( 'products__context_removable' );
            _contextMenu.removeClass( 'products__context_moderateble' );


            if( removable || moderateble ){

                _productId = row.data( 'id' );
                _currentRow = row;

                if ( removable ){
                    _contextMenu.addClass( 'products__context_removable' );
                }
                if ( moderateble ){
                    _contextMenu.addClass( 'products__context_moderateble' );
                }

                contextLeft = e.pageX - tablleBodyLeft;
                contextTop = e.pageY - tablleBodyTop + scrollTop;
                contextBottom = contextTop + _contextMenu.height();
                contextRight = contextLeft + _contextMenu.width();

                _contextMenu.removeClass( 'products__context_hidden' );

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

    //public methods

    _constructor();
};