from rest_framework import serializers
from vendor.models import Vendor
from userauth.serializer import ProfileSerializer

from .models import ( Category, 
Product, 
Gallery, 
Specification, 
Size, 
Color, 
Cart, 
CartOrderItem, 
ProductFag, 
Review, 
Wishlist, 
Coupon,
Notification,
CartOrder, )


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class GallerySerializer(serializers.ModelSerializer):

    class Meta:
        model = Gallery
        fields = "__all__"

class SpecificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specification
        fields = "__all__"

class SizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Size
        fields = "__all__"

                                                 
class ColorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Color
        fields = "__all__" 


class ProductSerializer(serializers.ModelSerializer):
    gallery = GallerySerializer(many=True, read_only=True)
    color = ColorSerializer(many=True, read_only=True)
    specification = SpecificationSerializer(many=True, read_only=True)
    size = SizeSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
                'id',
                'category',
                'title',
                'image',
                'description',
                'category',
                'price',
                'old_price',
                'shipping_amount',
                'stock_qty',
                'in_stock',
                'status',
                'featured',
                'views',
               # 'rating',
                'vendor',
                'gallery',
                'color',
                'specification',
                'size',
                'orders',
                'product_rating',
                'rating_count',
                'pid',
                'slug',
                'date',
        ] 

    def __init__(self, *args, **kwargs):
        super(ProductSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3  

class CartOrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartOrderItem
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartOrderItemSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CartOrderSerizer(serializers.ModelSerializer):
    orderitem = CartOrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = CartOrder
        fields = "__all__"
        
    def __ini__(self, *args, **kwargs):
        super(CartOrderSerizer, self).__init__ (*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3    


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = "__all__"

    def __init__(self, *args, **kwargs):

        super(CartSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3        
        
class ReviewSerializer(serializers.ModelSerializer):

    profile =ProfileSerializer()
    class Meta:
        model = Review
        fields = ["id", "review", "rating", "reply", "product", "user", "profile", "date"] 

    def __init__(self, *args, **kwargs):
        super(ReviewSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3          

class WishlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wishlist
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(WishlistSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3          
    
          
class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = "__all__" 

    def __init__(self, *args, **kwargs):
        super(CouponSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3       
          

class ProductFagSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductFag
        fields = "__all__" 

    def __init__(self, *args, **kwargs):
        super(ProductFagSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3    
     
class VendorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vendor
        fields = "__all__" 

    def __init__(self, *args, **kwargs):
        super(VendorSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3   

class NoteficationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = "__all__" 

    def __init__(self, *args, **kwargs):
        super(NoteficationSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")  
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3 

class SummarySerializer(serializers.Serializer):
    products = serializers.IntegerField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)


class EarningSerializer(serializers.Serializer):
    monthly_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)    


class CouponSummarygSerializer(serializers.Serializer):
    total_coupons = serializers.IntegerField()
    active_coupons = serializers.IntegerField()   

class NotificationSummarygSerializer(serializers.Serializer):
    un_read_noti = serializers.IntegerField()
    read_noti = serializers.IntegerField()
    all_noti = serializers.IntegerField()      
