from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # the default Django admin panel will be accessible at /django-admin/
    path('django-admin/', admin.site.urls),
    
    # the JWT authentication endpoints will be accessible at /api/auth/token/ and /api/auth/token/refresh/
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # the catalog and orders app endpoints will be accessible at /api/
    path('api/', include('apps.catalog.urls')),
    path('api/', include('apps.orders.urls')),
]

# the media files will be served in development mode only (DEBUG=True)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)