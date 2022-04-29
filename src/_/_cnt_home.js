// html product list loader
export const HTMLContent = (__) => {

    return `
    <div class="container">

        <div class="d-sm-flex justify-content-between bd-highlight mb-3">
            <nav class="bc" aria-label="breadcrumb"></nav>
            <button class="btn btn-primary btn-add mt-2 mt-sm-0" data-postid="0" type="button">${ __('Add article') }</button>
        </div>

        <div class="row">
            <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
                <div class="card border-white shadow-sm">
                    <div class="card-body">
                        <div class="no-footer">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="table-responsive">
                                        <table
                                            class="table table-hover table-borderless align-middle table-striped table-p-list"
                                            style="min-width: 800px;">
                                            <thead>

                                            </thead>
                                            <tbody>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-12 col-md-5">
                                    <div class="dataTables_info mt-3 text-secondary fw-lighter" id="listing_info"
                                        role="status" aria-live="polite">&nbsp;</div>
                                </div>
                                <div class="col-sm-12 col-md-7">
                                    <div class="dataTables_paginate paging_simple_numbers mt-3" id="listing_paginate">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal" tabindex="-1">
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


    
    `;

}