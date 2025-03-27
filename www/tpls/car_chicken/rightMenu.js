export const rightTpl = {
	data() {
	  return {
		dataR: 'RRRRRR'
	  };
	},
	methods: {

	  dotestR() {
		alert('dotestR');
	  }
	},
	mounted() {
	  // 初始化
	  console.log('init dataA:', this.dataA);
	  //dotest();
	},
	template: `
                <!-- BEGIN pos-sidebar -->
            <div class="pos-sidebar" id="pos-sidebar">
                <div class="pos-sidebar-header">
                    <div class="back-btn">
                        <button type="button" data-dismiss-class="pos-mobile-sidebar-toggled" data-target="#pos-customer" class="btn">
                            <svg viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                            </svg>
                        </button>
                    </div>
                    <!-- <div class="icon"><img src="../assets/img/pos/icon-table.svg" /></div> -->
                    <div class="title">車隊查詢</div>
                    <!-- <div class="order">Order: <b>#0056</b></div> -->
                </div>
                <div class="pos-sidebar-nav">
                    <ul class="nav nav-tabs nav-fill">
                        <li class="nav-item">
                            <a class="nav-link active" href="#" data-bs-toggle="tab" data-bs-target="#newOrderTab">車輛車隊</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-bs-toggle="tab" data-bs-target="#orderHistoryTab">地標(客戶)名稱</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-bs-toggle="tab" data-bs-target="#orderHistoryTab2">其它</a>
                        </li>
                    </ul>
                </div>
                <div class="pos-sidebar-body tab-content" data-scrollbar="true" data-height="100%">
                    <div class="tab-pane fade h-100 show active" id="newOrderTab">
                        <div class="pos-table">
                            <div class="row pos-table-row">
                                <div class="col-9">
                                    <div class="pos-product-thumb">
                                        <!-- <div class="img" style="background-image: url(../assets/img/pos/product-2.jpg)"></div> -->
                                        <div class="info">
                                            <div class="title">Grill Pork Chop</div>
                                            <div class="single-price">$12.99</div>
                                            <div class="desc">- size: large</div>
                                            <div class="input-group qty">
                                                <div class="input-group-append">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" class="form-control" value="01" />
                                                <div class="input-group-prepend">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3 total-price">$12.99</div>
                            </div>
                            <div class="row pos-table-row">
                                <div class="col-9">
                                    <div class="pos-product-thumb">
                                        <!-- <div class="img" style="background-image: url(../assets/img/pos/product-8.jpg)"></div> -->
                                        <div class="info">
                                            <div class="title">Orange Juice</div>
                                            <div class="single-price">$5.00</div>
                                            <div class="desc">
                                                - size: large<br />
                                                - less ice
                                            </div>
                                            <div class="input-group qty">
                                                <div class="input-group-append">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" class="form-control" value="02" />
                                                <div class="input-group-prepend">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3 total-price">$10.00</div>
                                <div class="pos-remove-confirmation">
                                    <svg width="2em" height="2em" viewBox="0 0 16 16" class="me-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                    Remove this item? 
                                    <a href="#" class="btn btn-white ms-auto me-2">No</a>
                                    <a href="#" class="btn btn-danger">Yes</a>
                                </div>
                            </div>
                            <div class="row pos-table-row">
                                <div class="col-9">
                                    <div class="pos-product-thumb">
                                        <!-- <div class="img" style="background-image: url(../assets/img/pos/product-1.jpg)"></div> -->
                                        <div class="info">
                                            <div class="title">Grill chicken chop</div>
                                            <div class="single-price">$10.99</div>
                                            <div class="desc">
                                                - size: large<br />
                                                - spicy: medium
                                            </div>
                                            <div class="input-group qty">
                                                <div class="input-group-append">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" class="form-control" value="01" />
                                                <div class="input-group-prepend">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3 total-price">$10.99</div>
                            </div>
                            <div class="row pos-table-row">
                                <div class="col-9">
                                    <div class="pos-product-thumb">
                                        <!-- <div class="img" style="background-image: url(../assets/img/pos/product-5.jpg)"></div> -->
                                        <div class="info">
                                            <div class="title">Hawaiian Pizza</div>
                                            <div class="single-price">$15.00</div>
                                            <div class="desc">
                                                - size: large<br />
                                                - more onion
                                            </div>
                                            <div class="input-group qty">
                                                <div class="input-group-append">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" class="form-control" value="01" />
                                                <div class="input-group-prepend">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3 total-price">$15.00</div>
                            </div>
                            <div class="row pos-table-row">
                                <div class="col-9">
                                    <div class="pos-product-thumb">
                                        <!-- <div class="img" style="background-image: url(../assets/img/pos/product-10.jpg)"></div> -->
                                        <div class="info">
                                            <div class="title">Mushroom Soup</div>
                                            <div class="single-price">$3.99</div>
                                            <div class="desc">
                                                - size: large<br />
                                                - more cheese
                                            </div>
                                            <div class="input-group qty">
                                                <div class="input-group-append">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" class="form-control" value="01" />
                                                <div class="input-group-prepend">
                                                    <a href="#" class="btn btn-default"><i class="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3 total-price">$3.99</div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade h-100" id="orderHistoryTab">
                        <div class="h-100 d-flex align-items-center justify-content-center text-center p-20">
                            <div>
                                <div class="mb-3 mt-n5">
                                    <svg width="6em" height="6em" viewBox="0 0 16 16" class="text-gray-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M14 5H2v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5zM1 4v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4H1z"/>
                                        <path d="M8 1.5A2.5 2.5 0 0 0 5.5 4h-1a3.5 3.5 0 1 1 7 0h-1A2.5 2.5 0 0 0 8 1.5z"/>
                                    </svg>
                                </div>
                                <h4>No order history found</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pos-sidebar-footer">
                    <div class="subtotal">
                        <div class="text">Subtotal</div>
                        <div class="price">$30.98</div>
                    </div>
                    <div class="taxes">
                        <div class="text">Taxes (6%)</div>
                        <div class="price">$2.12</div>
                    </div>
                    <div class="total">
                        <div class="text">Total</div>
                        <div class="price">$33.10</div>
                    </div>
                    <div class="btn-row">
                        <a href="#" class="btn btn-default"><i class="fa fa-bell fa-fw fa-lg"></i> Service</a>
                        <a href="#" class="btn btn-default"><i class="fa fa-file-invoice-dollar fa-fw fa-lg"></i> Bill</a>
                        <a href="#" class="btn btn-success"><i class="fa fa-check fa-fw fa-lg"></i> Submit Order</a>
                    </div>
                </div>
            </div>
            <!-- END pos-sidebar -->
  `
  };