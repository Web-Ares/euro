var Content = function (obj) {

    //private properties
    var _self = this,
        _obj = obj,
        _sortForm = _obj.find( '.content__filter' ),
        _sortDirectionChk = _sortForm.find( '#order-filter__chk' ),
        _sortSelect = _sortForm.find( 'select' ),
        _filterInput = _sortForm.find( 'input.filter__input' ),
        _tableBody = _obj.find( '.table__body' ),
        _userId = _tableBody.data( 'id' ),
        _tableHeader = _obj.find( '.table__headers' ),
        _loader = _obj.find( '.table__load' ),
        _dataOrderArray = [],
        _waitingForAnswer = false,
        _filterText = '',
        _productId = null,
        _request = new XMLHttpRequest();

    //private methods
    var _addSortedRows = function ( data ) {
            var row = null,
                rows = [],
                currentRowData = null;
        
            if ( data.products_left < 1 ){
                _loader.removeClass( 'loader__loading' )
            } else {
                _loader.addClass( 'loader__loading' )
            }
        
            $.each( data.products, function () {
                currentRowData = this;
                row = $( '<div class="table__row" data-id="'+ currentRowData.id +'"></div>' );

                if( !currentRowData.moderated ){
                    row.addClass( 'table__row_moderateble' );
                }

                if( currentRowData.user_id === _userId ){
                    row.addClass( 'table__row_removable' );
                }

                $.each( _dataOrderArray, function() {
                    row.append( '<div class="table__cell">'+ currentRowData[ this ] +'</div>' );
                } );

                $.merge(rows, row);
            } );

            _loader.before( rows );

        },
        _checkScroll = function () {
            if( !_waitingForAnswer && _loader.hasClass( 'loader__loading' ) && ( ( _tableBody.find( '>div:first-child' ).height() - _tableBody.height() - _tableBody.scrollTop() ) < 60 ) ) {
                _sortData( true );
            }
        },
        _constructor = function () {
            _onEvents();
            _initSelects();
            _initTableScroll();
            _getDataOrderArrey();
            _obj[0].obj = _self;
        },
        _getDataOrderArrey = function () {
            _tableHeader.find( '.table__cell' ).each( function () {
                _dataOrderArray.push( $(this).data( 'value' ) );
            } );
        },
        _initSelects = function () {
            $( function(){
                $( 'select' ).each( function(){
                    new WebstersSelect( {
                        obj: $( this ),
                        optionType: 1,
                        showType: 2
                    } );
                } );
            } );
        },
        _initTableScroll = function() {
            _tableBody.perfectScrollbar( {
                suppressScrollX: true
            } );
        },
        _onEvents = function () {
            _sortForm.on( {
                submit: function () {
                    _sortData();
                    return false;
                }
            } );
            _sortDirectionChk.on( {
                change: function () {
                    _sortForm.trigger( 'submit' );
                }
            } );
            _sortSelect.on( {
                change: function () {
                    _sortForm.trigger( 'submit' );
                }
            } );
            _filterInput.on( {
                keyup: function () {
                    if( _filterText != $( this ).val() ){
                        _filterText = $( this ).val();
                        _sortForm.trigger( 'submit' );

                    }
                }
            } );
            _tableBody.on( {
                scroll: function () {
                    _checkScroll();
                }
            } );
        },
        _sortData = function ( isScroll ) {
            var data = _sortForm.serialize();

            _tableBody.addClass( 'loader__loading' );
            _waitingForAnswer = true;

            if( isScroll ){
                data += ( '&loaded_count=' + $( '.table__row' ).length );
            } else {
                _tableBody.scrollTop( 0 );
                data += ( '&loaded_count=0' );
                _tableBody.find( '.table__row' ).remove();
            }

            _request.abort();
            _request = $.ajax({
                url: _sortForm.attr( 'action' ),
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                data: data,
                dataType: 'json',
                timeout: 20000,
                type: 'post',
                success: function ( data ) {
                    _addSortedRows( data );
                    _waitingForAnswer = false;
                    _tableBody.removeClass( 'loader__loading' );

                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.statusText != "abort") {
                        console.log(XMLHttpRequest.responseText);
                        _container.removeClass( 'loader__loading' );

                    }
                }
            });
        };

    //public properties

    //public methods
    _self.sortData = function () {
        _sortData();
    };

    _constructor();
};
