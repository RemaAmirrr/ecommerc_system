from django.contrib import admin
from store.models import Product, Tax, Category, Gallery, Specification, Size, Color, Cart, CartOrder, CartOrderItem, Review , Wishlist, Notification, Coupon, Gallery

class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 3

class SpecificationInline(admin.TabularInline):
    model = Specification
    extra = 3
    
class SizeinlIne(admin.TabularInline):
    model = Size
    extra = 3

class ColorinlIne(admin.TabularInline):
    model = Color
    extra = 3

class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", 'price', 'category', 'stock_qty', "in_stock", 'vendor', 'featured']
    #list_editable = ['featured']
    list_filter = ['date']
    search_fields = ['title']
    inlines = [GalleryInline, SpecificationInline, SizeinlIne, ColorinlIne]
    
admin.site.register(Category)
admin.site.register(Product, ProductAdmin)

class CartOrderInline(admin.TabularInline):
    list_display = []

class CartOrderItemInline(admin.TabularInline):
    list_display = []
    
class CartAdimn(admin.ModelAdmin):
    list_display = ["cart_id"]
    list_filter = ['date']
    search_fields = ['title']

class ReviewAdime(admin.ModelAdmin):
    list_display = ["user", "product"] 

class Wishlistadmin(admin.ModelAdmin):
    list_display=["user"]  

class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "vendor", "order"]

class CoponAdmin(admin.ModelAdmin):
    list_display = ["vendor", ]

class CartorderAdmin(admin.ModelAdmin):
    list_display = ['payment_status', 'order_status', 'total']
    list_display = ['oid', 'buyer', 'payment_status', 'order_status', 'total', 'date']

admin.site.register(Cart, CartAdimn)
admin.site.register(CartOrder, CartorderAdmin)
admin.site.register(CartOrderItem)
admin.site.register(Review, ReviewAdime)
admin.site.register(Wishlist, Wishlistadmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Coupon, CoponAdmin)
admin.site.register(Tax)



