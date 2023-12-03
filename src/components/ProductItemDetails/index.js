import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    similarProductList: [],
    specificProduct: {},
    apiStatus: apiConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getSpecificDetails()
  }

  similarformattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getSpecificDetails = async () => {
    this.setState({apiStatus: apiConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    //  console.log(jwtToken)
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const specificFormattedData = this.similarformattedData(data)
      console.log(specificFormattedData)
      const similarformattedData = data.similar_products.map(each =>
        this.similarformattedData(each),
      )
      this.setState({
        apiStatus: apiConstants.success,
        similarProductList: similarformattedData,
        specificProduct: specificFormattedData,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrement = () =>
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))

  renderSpecificProduct = () => {
    const {similarProductList, specificProduct, quantity} = this.state
    console.log(similarProductList)
    console.log(specificProduct)
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = specificProduct
    return (
      <div className="specific-details-container">
        <Header />
        <div className="selected-product-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <p className="description">{description}</p>
            <div className="review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>

              <p className="review">{totalReviews} Reviews</p>
            </div>
            <div className="brand-container">
              <p className="brand">Brand:</p>
              <p className="highlight">{brand}</p>
            </div>

            <div className="availability-container">
              <p className="available">Available:</p>
              <p className="highlight">{availability}</p>
            </div>

            <hr className="h-line" />
            <div className="increment-decrement-container">
              <button
                data-testid="minus"
                onClick={this.onDecrement}
                type="button"
                className="quantity-controller-button"
              >
                <BsDashSquare className="icon" />
              </button>

              <p className="quantity">{quantity}</p>
              <button
                className="quantity-controller-button"
                data-testid="plus"
                onClick={this.onIncrement}
                type="button"
                id="popup"
              >
                <BsPlusSquare className="icon" htmlFor="popup" />
              </button>
            </div>
            <button type="button" className="cart-button">
              Add To Cart
            </button>
          </div>
        </div>
        <div className="similar-product-container">
          <h1 className="title">Similar Product</h1>
          <ul className="unOrderList-similar-product-container">
            {similarProductList.map(each => (
              <SimilarProductItem key={each.id} productDetails={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderInprogress = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view"
      />
      <h1>Product Not Found</h1>
      <button
        className="shopping-button"
        type="button"
        onClick={this.continueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderSpecificProduct()

      case 'FAILURE':
        return this.renderFailureView()

      case 'INPROGRESS':
        return this.renderInprogress()

      default:
        return null
    }
  }
}

export default ProductItemDetails
