const prodsDiv = document.querySelector(".main-products__products");
let profileNickname = location.pathname.split("/");
profileNickname = profileNickname[profileNickname.length-1];

function deleteProduct(id){
    axios.delete(`/api/products/${id}` ).then(res =>{
        getProducts();
    });
}

function getProducts(){
	axios.get(`/api/products/profile/${profileNickname}`).then(res=>{
		showProducts(res.data);
    });
}

function showProducts(prods){
    let prodsHTML = ``;

    for(let i=0;i< prods.length; i++){
        prodsHTML += `
        <div class="main-products__product">
            <img width="200px" height="200px" src="${prods[i].img}" alt="Product image">
            <p>${prods[i].title}</p>
            <p>${prods[i].description}</p>
            <p>${prods[i].price}</p>
            <ul class="main-products__editing">
                <a onclick="deleteProduct('${prods[i]._id}')" class="main-products__delete">&#10006;</a>    
                <a href="/editProduct?id=${prods[i]._id}" class="main-products__edit">Edit</a>
            </ul> 
        </div>
        `;
    }
    if(prods.length===0 ){
        prodsHTML = "<h2> 0 products </h2>"
    }
	prodsDiv.innerHTML = prodsHTML;
}