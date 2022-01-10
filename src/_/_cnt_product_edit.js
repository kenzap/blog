// html product list loader
export const HTMLContent = (__) => {

return `
  <div class="container p-edit">
    <div class="d-flex justify-content-between bd-highlight mb-3">
        <nav class="bc" aria-label="breadcrumb"></nav>
        
    </div>
    <div class="row">
        <div class="col-lg-9 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
            <div class="sections" id="sections" role="tablist" style="width:100%;">

                <div class="row">
                    <div class="col-12 grid-margin stretch-card">
                        <div class="card border-white shadow-sm p-sm-3">
                            <div class="card-body">

                                <div class="landing_status"></div>
                                <input type="hidden" class="form-control" id="landing-slug" value="">

                                <h4 id="elan" class="card-title mb-4">${ __('Description') }</h4>

                                <div id="placeholders">

                                    <div class="mb-3">
                                        <label class="banner-title-l form-label" for="p-title">${ __('Title') }</label>
                                        <input type="text" class="form-control inp" id="p-title"
                                            placeholder="${ __('Sushi set..') }">
                                        <p class="form-text"> </p>
                                    </div>

                                    <div class="mb-3">
                                        <label class="banner-descshort-l form-label" for="p-sdesc">${ __('Short Description') }</label>
                                        <textarea class="form-control inp" id="p-sdesc" placeholder="  " maxlength="120" rows="2"></textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label class="banner-descshort-l form-label" for="desc">${ __('Images') }</label>
                                        <div class="clearfix"></div>
                                        <div class="ic"></div>
                                        <div class="clearfix"></div>
                                    </div>

                                    <div class="mb-3">
                                        <div class="clearfix"></div>
                                        <div style="clear:both;margin-top:16px;"></div>
                                        <label class="banner-descshort-l form-label" for="p-desc">${ __('Description') }</label>
                                        <textarea class="form-control inp" id="p-ldesc" placeholder=" " maxlength="2000" rows="10"></textarea>
                                    </div>

                                    <div class="mb-3 mw">
                                        <div class="list-wrapper">
                                            <ul class="d-flex flex-column-reverse features"> </ul>
                                        </div>
                                        <p class="form-text"> </p>
                                    </div>

                                    <div class="bg-light price_group mt-3 mb-3 p-4">
                                        <h4 class="card-title mb-3">${ __('Price') }</h4>
                                        <div class="price_group_base">
                                            <div class="mb-3 mw">
                                                <div class="input-group">

                                                    <div id="p-price-c">
                                                        <label for="p-price" class="form-label">${ __('Price normal') } <span class="lang"></span></label>
                                                        <div class="input-group">
                                                            <span class="input-group-text">$</span>
                                                            <input id="p-price" type="text" class="form-control inp" placeholder="55.00" autocomplete="off">
                                                        </div>
                                                    </div>
                                                    <div id="p-priced-c">
                                                        <label for="p-priced" class="form-label">${ __('Discounted') } <span class="lang"></span></label>
                                                        <input id="p-priced" type="text" class="form-control inp" placeholder="45.00" autocomplete="off">
                                                    </div>

                                                </div>
                                                <div class="add-mix-ctn"><a class="add-mix-block" href="#" data-action="add">${ __('+ add variation') }</a></div>
                                            </div>

                                            <div class="variation-blocks">

                                            </div>

                                            <div style='margin:24px 0 48px;border-bottom:0px solid #ccc;'></div>

                                            <div class="mb-3 mw">
                                                <h4 id="elan" class="card-title">${ __('Inventory') }</h4>
                                                <label for="p-sku" class="form-label"> <span class="lang"></span></label>
                                                <div class="input-group">
                                                    <input id="p-sku" type="text" style="width:100%;" class="form-control inp" placeholder="" maxlength="200">
                                                    <p class="form-text">
                                                        Product stock unit identification number
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div class="desc-repeater-cont">

                                </div>

                                <p class="form-text"> &nbsp;</p>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <div class="col-lg-3 grid-margin grid-margin-lg-0 grid-margin-md-0">

            <div class="row">
                <div class="col-12 grid-margin stretch-card">
                    <div class="card border-white shadow-sm p-sm-3">
                        <div class="card-body">

                            <h4 class="card-title" style="display:none;">${ __('General') }</h4>
                            <div class="landing_status"></div>
                            <input type="hidden" class="form-control" id="landing-slug" value="">

                            <h4 id="elan" class="card-title mb-4">Status</h4>
                            <div id="status-cont" class="mb-3">

                                <div class="col-sm-12">
                                    <div class="form-check">
                                        <label class="form-check-label status-publish form-label">
                                            <input type="radio" class="form-check-input" name="p-status"
                                                id="p-status1" value="1">
                                                ${ __('Published') }
                                        </label>
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="form-check">
                                        <label class="form-check-label status-draft form-label">
                                            <input type="radio" class="form-check-input" name="p-status"  id="p-status0" value="0">
                                            ${ __('Draft') }
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <h4 id="elan" class="card-title mb-4">Categories</h4>
                            <div id="p-cats" class="simple-tags mb-4" data-simple-tags=""></div>
                            <div class="clearfix"> </div>

                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-save" type="button">${ __('Save') }</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  </div>

  <div class="modal p-modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary btn-modal"></button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>
            </div>
        </div>
    </div>
  </div>

  <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">
    <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive"
        aria-atomic="true" data-bs-delay="3000">
        <div class="d-flex">
            <div class="toast-body"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
  </div>
  `;
}