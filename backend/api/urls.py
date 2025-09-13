from django.urls import path

from userauth import views as userauth_views
from store import views as store_views
from rest_framework_simplejwt.views import TokenRefreshView
from customer  import views as custome_views
from vendor import views as vendor_views


urlpatterns = [
    
    path('user/token/', userauth_views.MyTokenObtainParirView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),
    path('user/register/', userauth_views.RegisterView.as_view()),
    path('user/password-reset/<email>/', userauth_views.PasswordResatEmailVerify.as_view()),
    path('user/password-change/', userauth_views.PasswordChangeView.as_view()),
    path('user/profile/<user_id>/', userauth_views.ProfileView.as_view()),

    #Store Url
    path('category/', store_views.CategoryListApiView.as_view()),
    path('product/', store_views.ProductListApiView.as_view()),
    path('product/<slag>/', store_views.ProductDitailApiView.as_view()),
    path('cart_view/', store_views.CartAPIView.as_view()),
    path('cart-list/<str:cart_id>/<int:user_id>/', store_views.CartListView.as_view()),
    path('cart-list/<str:cart_id>/', store_views.CartListView.as_view()),
    path('cart-detail/<str:cart_id>/', store_views.CartDetailView.as_view()),
    path('cart-detail/<str:cart_id>/<int:user_id>/', store_views.CartDetailView.as_view()),
    path('cart-delete/<str:cart_id>/<int:user_id>/<int:item_id>/', store_views.CartItemDeleteAPIView.as_view()),
    path('cart-delete/<str:cart_id>/<int:item_id>/', store_views.CartItemDeleteAPIView.as_view()), #only for dont put / in  end this url take a lot of time of me you should be carfule
    path('create-order/', store_views.CreateOrderAPIView.as_view()),
    path('checkout/<order_oid>/', store_views.CheckoutView.as_view()),
    path('coupon/',store_views.CouponAPIView.as_view()),
    path('reviews/<product_id>/',store_views.ReviewListApIView.as_view()),
    path('search/',store_views.SearchProductAPIView.as_view()),


    # Payment Endpoints
    # path('stripe-checkout/<order_oid>/',store_views.StripeCheckoutView.as_view()),
    # path('payment-success/<order_oid>/',store_views.StripeCheckoutView.as_view()),

    # customer views
    path('customer/orders/<user_id>/',custome_views.OrdersAPIView.as_view()),
    path('customer/order_detail/<order_oid>/',custome_views.OrderDetailAPIView.as_view()),
    path('customer/wishlist/<user_id>/',custome_views.WishListAPIView.as_view()),
    path('customer/notifications/<user_id>/',custome_views.CustomerNotification.as_view()),
    path('customer/marknotificationasseen/<user_id>/<noti_id>/',custome_views.MarkNotificationAsSeen.as_view()),
    
    # Vendor views
    path('vendor/state/<vendor_id>/',vendor_views.DashboardStatsAPIView.as_view()),
    path('vendor-orders-chart/<vendor_id>/', vendor_views.MonthlyOrderChartAPIView),
    path('vendor-product-chart/<vendor_id>/', vendor_views.MonthlyProductChartAPIView),
    path('vendor/product/<vendor_id>/', vendor_views.ProductAPIviews.as_view()),
    path('vendor/order/<vendor_id>/', vendor_views.OrderAPIView.as_view()),
    path('vendor/orderDetail/<vendor_id>/<order_oid>/', vendor_views.OrderDetailAPIView.as_view()),
    path('vendor/order/filter/<vendor_id>/', vendor_views.FilterOrderAPIVew.as_view()),
    path('vendor/changevendororder/<vendor_id>/<order_oid>/', vendor_views.ChangeVoendorOrder.as_view()),
    path('vendor/revenue/<vendor_id>/', vendor_views.RevenueAPIView.as_view()),
    path('vendor-product-filter/<vendor_id>/', vendor_views.FilterProductAPIView.as_view()),
    path('vendor-earning/<vendor_id>/', vendor_views.EarningAPIView.as_view()),
    path('vendor-monthly-earning/<vendor_id>/', vendor_views.MonthlyEarningTracker),
    path('vendor-reviews-detail-list/<vendor_id>/<review_id>/', vendor_views.ReviewDetailAPIView.as_view()),
    path('vendor-reviews/<vendor_id>/', vendor_views.ReviewListAPIView.as_view()),
    path('vendor-coupon-list/<vendor_id>/', vendor_views.CouponListAPIView.as_view()),
    path('vendor-coupon-detail/<vendor_id>/<coupon_id>/', vendor_views.CouponDetailAPIView.as_view()),
    path('vendor-coupon-stats/<vendor_id>/', vendor_views.CouponStatsAPIView.as_view()),
    path('vendor-noti-list/<int:vendor_id>/', vendor_views.NotificationAPIView.as_view()),
    path('vendor-noti-summary/<vendor_id>/', vendor_views.NotificationSummaryAPIView.as_view()),
    path('vendor-noti-mark-as-seen/<vendor_id>/<noti_id>/', vendor_views.NotificationVendorMarkAsSeen.as_view()),
    path('vendor-settings/<int:vendor_id>/', vendor_views.VendorsettingView.as_view()),
    # path('shop-view/<vendor_slug>/', vendor_views.ShopAPIView.as_view()),
    # path('vendor-shop-settings/<int:pk>/', vendor_views.ShopUpdateView.as_view()),
    path('vendor-products/<int:pk>/', vendor_views.ShopProductAPIView.as_view()),
    path('vendor-creat-products/', vendor_views.ProductCreateView.as_view()),
    path('vendor-update-product/<vendor_id>/<product_pid>/', vendor_views.ProductUpdateView.as_view()),
    path('vendor-delete-product/<vendor_id>/<product_pid>/', vendor_views.ProductDeleteAPIView.as_view()),
    

]