from rest_framework import generics, status
from  store.models import Category, Product, Cart, CartOrder, CartOrderItem, User, Tax, Coupon, Review, Wishlist, Notification
from  store.serializers import CategorySerializer, WishlistSerializer, SummarySerializer, ProductSerializer, CartSerializer,ReviewSerializer, NoteficationSerializer, CartOrderItemSerializer, CartOrderSerizer, CouponSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from decimal import Decimal
from rest_framework.response import Response
from django.shortcuts import redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

import stripe
import requests

class OrdersAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerizer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)  
        orders = CartOrder.objects.filter(buyer__email=user, payment_status="paid")
        return orders
    
class OrderDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartOrderSerizer
    permission_classes = [AllowAny,]

    def get_object(self):
        order_oid = self.kwargs['order_oid']
        print("==================================", order_oid)
        order = CartOrder.objects.get(oid=order_oid, payment_status="paid")
        return order    
    
    
class WishListAPIView(generics.ListCreateAPIView):
        serializer_class = WishlistSerializer
        permission_classes = [AllowAny,]

        def get_queryset(self):
            user_id = self.kwargs['user_id']
            user = User.objects.get(id = user_id)
            wishlists = Wishlist.objects.filter(user = user).all()
            return wishlists 
        
        def create(self, request, *args, **kwargs):
            payload = request.data
            product_id = payload['product_id']
            user_id = payload['user_id']
            user = User.objects.get(id = user_id)
            product = Product.objects.get(pid = product_id)
            wishlist = Wishlist.objects.filter(user = user, product = product)
           
            if wishlist.exists():
                wishlist.delete()
                return Response({'message': " Wishlist Succefully Deleted. "}, status=status.HTTP_200_OK)
            else:
                wishlist = Wishlist.objects.create(product=product, user=user)
                return Response({'message': " Wishlist Succefully Creat. "}, status=status.HTTP_201_CREATED)
            
class CustomerNotification(generics.ListAPIView):
    serializer_class = NoteficationSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
       user_id = self.kwargs['user_id']
       user = User.objects.get(id=user_id)
       return Notification.objects.filter(user=user, seen=False)
      
class MarkNotificationAsSeen(generics.RetrieveAPIView):
    serializer_class = NoteficationSerializer
    permission_classes = [AllowAny,]

    def get_object(self):
        noti_id = self.kwargs['noti_id']
        user_id = self.kwargs['user_id']
        user = User.objects.get(id = user_id)
        notification = Notification.objects.get(id=noti_id, user=user)
        if notification.seen != True:
            notification.seen = True
            notification.save()
        return notification    




           


             

