from rest_framework import generics, status
from  store.models import Category, Product, Cart, CartOrder, Vendor, CartOrderItem, Profile, User, Tax, Coupon, Review, Wishlist, Notification
from  store.serializers import CategorySerializer,ProfileSerializer, VendorSerializer, SpecificationSerializer, ColorSerializer, SizeSerializer,GallerySerializer, WishlistSerializer, NotificationSummarygSerializer, CouponSummarygSerializer, EarningSerializer, SummarySerializer, ProductSerializer, CartSerializer,ReviewSerializer, NoteficationSerializer, CartOrderItemSerializer, CartOrderSerizer, CouponSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from decimal import Decimal
from django.db import models, transaction
from rest_framework.response import Response
from django.shortcuts import redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.decorators import api_view
from django.db.models.functions import ExtractMonth

import datetime
from datetime import datetime, timedelta
import stripe
import requests


class DashboardStatsAPIView(generics.ListAPIView):
    serializer_class = SummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        
        #Calculate the summary values
        product_count = Product.objects.filter(vendor=vendor).count()
        order_count = CartOrder.objects.filter(vendor=vendor, payment_status="paid").count()
        revenue = CartOrderItem.objects.filter(vendor=vendor, order__payment_status="paid").aggregate(total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0

        return[{
            'products': product_count,
            'orders': order_count,
            'revenue': revenue,
        }]
    
    def list(self, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
@api_view(('GET',))
def MonthlyOrderChartAPIView(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    orders = CartOrder.objects.filter(vendor=vendor, payment_status="paid")
    order_by_month = orders.annotate(month=ExtractMonth("date")).values("month").annotate(orders=models.Count("id")).order_by("month")
    return Response(order_by_month)  

@api_view(('GET',))
def MonthlyProductChartAPIView(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    products = Product.objects.filter(vendor=vendor,)
    products_by_month = products.annotate(month=ExtractMonth("date")).values("month").annotate(products=models.Count("id")).order_by("month")
    return Response(products_by_month)


class ProductAPIviews(generics.ListAPIView):
     serializer_class = ProductSerializer
     permission_classes = [AllowAny,]
     
     def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Product.objects.filter(vendor=vendor).order_by('-id')

class OrderAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerizer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
       
        return CartOrder.objects.filter(vendor=vendor).order_by('-id') 

class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerizer
    permission_classes = [AllowAny,]

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        order_oid = self.kwargs['order_oid']
        vendor = Vendor.objects.get(id=vendor_id)
        print("==================================", vendor, order_oid)

        return CartOrder.objects.get(vendor=vendor, oid=order_oid)               

class RevenueAPIView(generics.ListAPIView):
    serializer_class = CartOrderItemSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return CartOrderItem.objects.filter(vendor=vendor, order__payment_status="paid").aggregate(total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0

class FilterOrderAPIVew(generics.ListAPIView):
     serializer_class = CartOrderSerizer
     permission_classes = [AllowAny,]

     def get_queryset(self):
          vendor_id = self.kwargs['vendor_id']
          vendor = Vendor.objects.get(id=vendor_id)
          filter = self.request.GET.get("filter") 
          
          if filter == 'paid':
               order = CartOrder.objects.filter(vendor=vendor, payment_status="paid").order_by('-id')
          elif filter == 'pending':
               order = CartOrder.objects.filter(vendor=vendor, payment_status="pending").order_by('-id')
          elif filter == 'processing':
               order = CartOrder.objects.filter(vendor=vendor, payment_status="processing").order_by('-id')
          elif filter == 'cancelled':
               order = CartOrder.objects.filter(vendor=vendor, payment_status="cancelled").order_by('-id')               
          elif filter == 'latest':
               order = CartOrder.objects.filter(vendor=vendor, payment_status="paid").order_by('-id')
          elif filter == 'oldest':
               order = CartOrder.objects.filter(vendor=vendor, payment_status="paid").order_by('id')
          elif filter == 'Pending':
               order = CartOrder.objects.filter(vendor=vendor, order_status="Pending", payment_status="Pending").order_by('-id')
          elif filter == 'Fulfilled':
               order = CartOrder.objects.filter(vendor=vendor, order_status="Pending", payment_status="Fulfilled").order_by('-id')               
          elif filter == 'Cancelled':
               order = CartOrder.objects.filter(vendor=vendor, order_status="Pending", payment_status="Cancelled").order_by('-id')     
          else:
               order = CartOrder.objects.filter(vendor=vendor, payment_status="paid").order_by('-id')
          return order  

class ChangeVoendorOrder(generics.RetrieveUpdateDestroyAPIView):
     serializer_class = CartOrderSerizer 
     permission_class = [AllowAny,]  

     def get_object(self):
          vendor_id = self.kwargs['vendor_id']
          order_oid = self.kwargs['order_oid']
          vendor = Vendor.objects.get(id=vendor_id)
          return CartOrder.objects.get(vendor=vendor, oid=order_oid)

               
class FilterProductAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        venfor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=venfor_id)
        filtee = self.request.GET.get("filter")

        if filter == "published":
            products = Product.objects.filter(vendor=vendor, status="published")
        elif filter == "in_review":
            products = Product.objects.filter(vendor=vendor, status="in_review")
        elif filter == "draft":
            products = Product.objects.filter(vendor=vendor, status="draft")
        elif filter == "disabled":
            products = Product.objects.filter(vendor=vendor, status="disabled")
        else:
            products = Product.objects.filter(vendor=vendor)

        return products

class EarningAPIView(generics.ListAPIView):
        serializer_class = EarningSerializer
        permission_classes = [AllowAny,]    

        def get_queryset(self):
            vendor_id = self.kwargs['vendor_id']
            vendor = Vendor.objects.get(id=vendor_id)
            one_month_age = datetime.today() - timedelta(days=28)
            monthly_revenue = CartOrderItem.objects.filter(vendor=vendor, order__payment_status="paid", date__gte=one_month_age).aggregate(total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0
            total_revenue = CartOrderItem.objects.filter(vendor=vendor, order__payment_status="paid").aggregate(total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0
            
            return[{
                'monthly_revenue': monthly_revenue,
                'total_revenue': total_revenue,
            }]
        
        def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        
@api_view(('GET',))     
def MonthlyEarningTracker(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    monthly_earning_tracker = (
        CartOrderItem.objects
        .filter(vendor=vendor, order__payment_status="paid")
        .annotate(month=ExtractMonth("date"))
        .values("month")
        .annotate(
            sales_count=models.Sum('qty'),
            total_earning=models.Sum(
                models.F('sub_total') + models.F('shipping_amount')
            )
        ).order_by('-month')
    )
    return Response(monthly_earning_tracker)
  

class ReviewListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id'] 
        vendor = Vendor.objects.get(id=vendor_id)
        return Review.objects.filter(product__vendor=vendor)  
      

class ReviewDetailAPIView(generics.RetrieveUpdateAPIView):
     serializer_class = ReviewSerializer
     permission_classes = [AllowAny,]

     def get_object(self):
         vendor_id = self.kwargs['vendor_id']
         review_id = self.kwargs['review_id']

         vendor = Vendor.objects.get(pk=vendor_id)
         review = Review.objects.get(id=review_id, product__vendor=vendor)
         return review

     def update(self, request, *args, **kwargs):
           payload = request.data
           review_id = payload['review_id']
           vendor_id = payload['vendor_id']
           reply = payload['reply']
           vendor = Vendor.objects.get(id=int(vendor_id))
           review = Review.objects.get(id=int(review_id), product__vendor=vendor)
           review.reply = reply
           review.save()
           return Response({"massage": "Review Created Successfully"}, status=status.HTTP_200_OK)   

          
class CouponListAPIView(generics.ListCreateAPIView):
    serializer_class = CouponSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
         
         vendor_id = self.kwargs['vendor_id']
         vendor = Vendor.objects.get(id=vendor_id)
         coupons = Coupon.objects.filter(vendor=vendor).all()
         
         return coupons
    
    def create(self, request, *args, **kwargs):
        payload = request.data

        vendor_id_ = payload['vendor_id']
        code = payload['code']
        discount = payload['discount']
        active = payload['active']

        vendor = Vendor.objects.get(id=vendor_id_)
        Coupon.objects.create(
            vendor=vendor,
            code=code,
            discount=discount,
            active = (active.lower() == 'true')
        )

        return Response({"message":"Coupon created successfully"}, status=status.HTTP_201_CREATED)

class CouponDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        coupon_id = self.kwargs['coupon_id']

        vendor = Vendor.objects.get(id=vendor_id)
        return Coupon.objects.get(vendor=vendor, id=coupon_id)  
    
#     def update(self, request, *args, **kwargs):
#            payload = request.data
           
#            code = payload['code']
#            vendor_id = payload['vendor_id']
#            discount = payload['discount']
#            active = payload['active']
#            coupon_id = payload['coupon_id']

#            vendor = Vendor.objects.get(id=int(vendor_id))
#            coupon = Coupon.objects.get(id=int(coupon_id), vendor=vendor)
#            coupon.code = code
#            coupon.active = active
#            coupon.discount = discount
#            coupon.save()
#            return Response({"massage": "Review updated Successfully"}, status=status.HTTP_200_OK)   
    
class CouponStatsAPIView(generics.ListAPIView):
           serializer_class = CouponSummarygSerializer
           permission_classes = [AllowAny,]

           def get_queryset(self):
               vendor_id = self.kwargs['vendor_id']
               vendor = Vendor.objects.get(id=vendor_id)

               total_coupons = Coupon.objects.filter(vendor=vendor).count()
               active_coupons = Coupon.objects.filter(vendor=vendor, active=True).count()

               return [{
                   'total_coupons': total_coupons,
                   'active_coupons': active_coupons,
               }]
           
           def list(self, request, *args, **kwargs):
                queryset = self.get_queryset()
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)
           
class NotificationAPIView(generics.ListAPIView):
    serializer_class = NoteficationSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        Vendor_id = self.kwargs['vendor_id']
        print("=======================================================", Vendor_id)
        vendor = Vendor.objects.get(id=Vendor_id)
        return Notification.objects.filter(vendor=vendor, seen=False).order_by('-id')
    
class NotificationSummaryAPIView(generics.ListAPIView):
    serializer_class = NotificationSummarygSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        un_read_noti = Notification.objects.filter(vendor=vendor, seen=False).count()
        read_noti = Notification.objects.filter(vendor=vendor, seen=True).count()
        all_noti = Notification.objects.filter(vendor=vendor).count()
        
        return [{
           "un_read_noti": un_read_noti,
           "read_noti": read_noti,
           "all_noti": all_noti, # in here just for make any spase give my erroe 
        }]

    def list(self, request, *args, **kwargs):
                queryset = self.get_queryset()
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)

class NotificationVendorMarkAsSeen(generics.RetrieveAPIView):
     serializer_class = NoteficationSerializer
     permission_classes = [AllowAny]

     def get_object(self):
          vendor_id = self.kwargs['vendor_id']
          noti_id = self.kwargs['noti_id']
          vendor = Vendor.objects.get(id=vendor_id)
          noti = Notification.objects.get(vendor=vendor, id=noti_id)
          noti.seen = True
          noti.save()
          return noti        
     
class VendorsettingView(generics.RetrieveUpdateAPIView):
     queryset = Vendor.objects.all()
     serializer_class = VendorSerializer  
     permission_classes = [AllowAny]

     def get_object(self):
          vendor_id=self.kwargs['vendor_id']
          return Vendor.objects.get(id=vendor_id)

class ShopUpdateView(generics.RetrieveUpdateAPIView):
     queryset = Vendor.objects.all()
     serializer_class = VendorSerializer  
     permission_classes = [AllowAny] 

class ShopAPIView(generics.RetrieveAPIView):
     serializer_class = VendorSerializer
     permission_classes = [AllowAny]

     def get_object(self):
          vendor_slug = self.kwargs['vendor_pid']
          return Vendor.objects.get(slug=vendor_slug)

class ShopProductAPIView(generics.ListAPIView):
     serializer_class = ProductSerializer
     permission_classes = [AllowAny,]

     def get_queryset(self):
          vendor_slug = self.kwargs['vendor_slug']
          vendor = Vendor.objects.get(slug=vendor_slug)
          return Product.objects.filter(vendor=vendor)                          
     
class ProductCreateView(generics.CreateAPIView):
     serializer_class = ProductSerializer
     queryset = Product.objects.all()

     @transaction.atomic
     def perform_create(self, serializer):
          serializer.is_valid(raise_exception=True)

          serializer.save()
          prodcut_instance = serializer.instance
         
          specifications_data = []
          colors_data = []
          sizes_data = []
          gallery_data = []

          for key, value in self.request.data.items():
                # sepcification[0][title]
               if key.startswith('specifications') and '[title]' in key:
                    index = key.split('[')[1].split(']')[0]
                    title = value
                    content_key = f'specifcations[{index}][content]'
                    content = self.request.data.get(content_key)
                    specifications_data.append({'title' : title, 'content' : content})

               elif key.startswith('colors') and '[name]' in key:
                    index = key.split('[')[1].split(']')[0]
                    name = value
                    price_key = f'colors[{index}][price]'
                    price = self.request.data.get(price_key)
                    colors_data.append({'name': name, 'price': price})    

               elif key.startswith('sizes') and '[name]' in key:
                    index = key.split('[')[1].split(']')[0]
                    name =value
                    price_key = f'sizes[{index}][price]'
                    price = self.request.data.get(price_key)
                    sizes_data.append({'name': name, 'price': price}) 

               elif key.startswith('gallery') and '[image]' in key:
                    index = key.split('[')[1].split(']')[0]
                    image = value
                    gallery_data.append({'image' : image})
                    
          print("specifications_data ===", specifications_data)        
          print("colors_data ===", colors_data)        
          print("sizes_data ===", sizes_data)        
          print("gallery_data ===", gallery_data) 

          self.save_nested_data(prodcut_instance, SpecificationSerializer, specifications_data) 
          self.save_nested_data(prodcut_instance, ColorSerializer, colors_data) 
          self.save_nested_data(prodcut_instance, SizeSerializer, sizes_data) 
          self.save_nested_data(prodcut_instance, GallerySerializer, gallery_data) 

     def save_nested_data(self, product_instance, serializer_class, data):
          serializer = serializer_class(data=data, many=True, context={'product_instance': product_instance})
          serializer.is_valid(raise_exception=True)
          serializer.save(product=product_instance)

class ProductUpdateView(generics.RetrieveUpdateAPIView):
     serializer_class = ProductSerializer
     queryset = Product.objects.all()

     def get_object(self):
        product_pid = self.kwargs['product_pid']
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        product = Product.objects.get(pid=product_pid, vendor=vendor)
        return product

     @transaction.atomic
     def update(self, request, *args, **kwargs):
          product = self.get_object()
          serializer = self.get_serializer(product, data=request.data)
          serializer.is_valid(raise_exception=True)
          self.perform_update(serializer)
          
         
          product.specification().delete()
          product.color().delete()
          product.size().delete()
          product.gallery().delete()
          

          specifications_data = []
          colors_data = []
          sizes_data = []
          gallery_data = []

          for key, value in self.request.data.items():
                # sepcification[0][title]
               if key.startswith('specifications') and '[title]' in key:
                    index = key.split('[')[1].split(']')[0]
                    title = value
                    content_key = f'specifcations[{index}][content]'
                    content = self.request.data.get(content_key)
                    specifications_data.append({'title' : title, 'content' : content})

               elif key.startswith('colors') and '[name]' in key:
                    index = key.split('[')[1].split(']')[0]
                    name = value
                    color_code_key = f'colors[{index}][color_code]'
                    color_code = self.request.data.get(color_code_key)
                    colors_data.append({'name': name, 'color_code': color_code})    

               elif key.startswith('sizes') and '[name]' in key:
                    index = key.split('[')[1].split(']')[0]
                    name =value
                    price_key = f'sizes[{index}][price]'
                    price = self.request.data.get(price_key)
                    sizes_data.append({'name': name, 'price': price}) 

               elif key.startswith('gallery') and '[image]' in key:
                    index = key.split('[')[1].split(']')[0]
                    image = value
                    gallery_data.append({'image' : image})
              
                    
          print("specifications_data ===", specifications_data)        
          print("colors_data ===", colors_data)        
          print("sizes_data ===", sizes_data)        
          print("gallery_data ===", gallery_data) 

          self.save_nested_data(product, SpecificationSerializer, specifications_data) 
          self.save_nested_data(product, ColorSerializer, colors_data) 
          self.save_nested_data(product, SizeSerializer, sizes_data) 
          self.save_nested_data(product, GallerySerializer, gallery_data) 

          return Response({"massage": "Product updated Successfully"}, status=status.HTTP_200_OK)   

     def save_nested_data(self, product_instance, serializer_class, data):
          serializer = serializer_class(data=data, many=True, context={'product_instance': product_instance})
          serializer.is_valid(raise_exception=True)
          serializer.save(product=product_instance)
          
          



class ProductDeleteAPIView(generics.DestroyAPIView):
     queryset = Product.objects.all()
     serializer_class = ProductSerializer

     def get_object(self):
          vendor_id = self.kwargs['vendor_id']
          product_pid = self.kwargs['product_pid']

          vendor = Vendor.objects.get(id=vendor_id)
          product = Product.objects.get(pid=product_pid, vendor=vendor)
          return product          