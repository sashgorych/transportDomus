initOrderList(ordersArray);

function initOrderList(orders) {
    $("#myrequestCount").html(orders.length)
    let orderListHtml = createOrderListTemplate(orders)
    $('.my-requests-history').html(orderListHtml)
}

function createOrderListTemplate(orders) {
    let str = ``
    orders.forEach(order => {
        str += createOrderTemplate(order)
    })
    return str
}

function getBidsTemplate(bidsArray) {
    let str = ``
    bidsArray.forEach((bid, ind) => {
        str += createBidsTemplate(bid)
    })
    return str;
}

function createBidsTemplate(bid) {
    console.log(bid);
    let cls = (bid["obj[data][status]"] == "accept") ? "disabled": "x"
    return `
        <div class="order-row-container ${cls}"  data-info="" data-bid="">
    <div class="order-row">
                      <div><p>${bid["obj[data][expert_date]"]}</p></div>
                      <div><p>${bid["obj[data][time]"]}</p></div>
                      <div><p>${bid["obj[data][payment_type]"] ? bid["obj[data][payment_type]"] : " - "}</p></div>
                      <div><p>${bid["obj[data][fixed_payment]"] ? bid["obj[data][fixed_payment]"] : " - "}</p></div>
                      <div><p>${bid["obj[data][hour_cost]"] ? bid["obj[data][hour_cost]"] : " - "}</p></div>
                      <div><p>${bid["obj[data][min_hours]"] ? bid["obj[data][min_hours]"] : " - "}</p></div>
                      <div><p>${bid["obj[data][transportation_cost]"] ? bid["obj[data][transportation_cost]"] : " - "}</p></div>
                      <div><p>${bid["obj[data][created]"]}</p></div>
                      <div><button class="acceptBidBtn" ${cls} data-bidid="${bid["obj[data][bid_id]"]}">Accept</button></div>
                  </div>
                  </div>
    `
}
function deleteOrder(order_id){

}
function createOrderTemplate(order) {
    let canDelete = order["obj[data][order_status]"] == "created";
    let btnDelete = canDelete ? `<a href="" class="delete-request btn btn-danger" onclick="deleteOrder(${order["obj[data][order_id]"]})">${deleteText}</a>` : ``;
    let bids = JSON.parse(order["obj[data][bids]"]).length;
    let bidsTemplate = getBidsTemplate(JSON.parse(order["obj[data][bids]"]))
    let img_src = (order["obj[data][service_type]"] == "moving" || order["obj[data][service_type]"] == "delivery") ? "icon_delivery.svg" : "icon_waste.svg";
    let bidsblock = order["obj[data][order_status]"] == "completed" ? `` : `
        <div class="bids-block">
          <p class="bids">All bids: </p>
          <div class="bids-list-container">
                    <div class="orders-list shadow">
              <div class="order-row order-row-title">
                  <div><p>Date</p></div>
                  <div><p>Time</p></div>
                  <div><p>Payment Type</p></div>
                  <div><p>Fixed price, $</p></div>
                  <div><p>Per hour, $</p></div>
                  <div><p>Minimum hour</p></div>
                  <div><p>Travel expenses, $ </p></div>
                  <div><p>Created At</p></div>
                  <div><p>Action</p></div>
              </div>
 <div id="orders-list">
 ${bidsTemplate ? bidsTemplate : `<div class='no-bids'>${noBidstext}</div>`}
 </div>
          </div>
          </div>
</div>
    `;
    let str = `
<div class="request-container">
        <div class="my-requests-history-item shadow">
            <div class="my-request-icon">
                <img src="/images/${img_src}" alt="icon">
            </div>
            <div class="my-request-info">
                <p>${requestText} <span>#${order["obj[data][order_id]"]}</span></p>
                <p>
                   ${order["obj[data][service_type]"]}
                </p>
                <p>
                   ${created_atText}  ${order["obj[data][created_at]"]}
                </p>
            </div>
            <div class="my-request-addinfo">
                <p>Status: <span>${order["obj[data][order_status]"]}</span></p>
                <p>Bids: <span>${bids}</span></p>
            </div>
            <div class="my-request-view">
              <a href="" class="view">${viewText}</a>
              ${btnDelete}
            </div>
    </div>
    ${bidsblock}
    </div>
`
    return str;
}


