import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, imageUrl, price, rating, brand} = productDetails
  return (
    <li className="list-similar-product-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <h1 className="title">{title}</h1>
      <p className="highlight">By {brand}</p>
      <div className="price-rating-container">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
