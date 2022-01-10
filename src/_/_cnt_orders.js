export const HTMLContent = (__) => {

    return `
      <div class="container ec-orders">
        <div class="d-flex justify-content-between bd-highlight mb-3">
            <nav class="bc" aria-label="breadcrumb"></nav>
        </div>
        <div class="row">
          <div class="col-md-12 page-title">
            <div class="st-opts st-table mb-3 dropdown">
                <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="order-status" data-id="status" data-value="" data-bs-toggle="dropdown" aria-expanded="false">
                  All
                </a>
                <ul class="dropdown-menu" aria-labelledby="order-status">
                  <li><a class="dppi dropdown-item" data-key="" href="#" >All</a></li>
                  <li><a class="dppi dropdown-item" data-key="new" href="#" >New</a></li>
                  <li><a class="dppi dropdown-item" data-key="processing" href="#" >Processing</a></li>
                  <li><a class="dppi dropdown-item" data-key="completed" href="#" >Completed</a></li>
                  <li><a class="dppi dropdown-item" data-key="canceled" href="#" >Canceled</a></li>
                  <li><a class="dppi dropdown-item" data-key="failed" href="#" >Failed</a></li>
                </ul>
            </div>
            <div class="st-opts" >
              <div class="input-group-sm mb-0 justify-content-start" >
                <input id="usearch" type="text" class="inp form-control search-input" placeholder="${ __('Search order') }">
              </div>
              <!-- <a id="viewSum" href="#" style="margin-left:16px;">view summary</a> -->
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
            <div class="card border-white shadow-sm">
              <div class="card-body">
 
                <div class="table-responsive">
                  <table class="table table-hover table-borderless align-middle table-striped table-p-list">
                    <thead>
                      <tr>

                        <th>From</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Time</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody class="list">

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal order-modal" tabindex="-1">
        <div class="modal-dialog ">
          <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"></button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>
              </div>
          </div>
        </div>
      </div>

      <div class="position-fixed bottom-0 p-sm-2 m-sm-4 end-0 align-items-center" >   
        <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
          <div class="d-flex">  
            <div class="toast-body"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    `;
}