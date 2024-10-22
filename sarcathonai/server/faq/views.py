from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import search_faqs

class FAQSearchView(APIView):
    def post(self, request):
        query = request.data.get('query', '').strip()
        
        if not query:
            return Response(
                {"error": "Query cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            results = search_faqs(query)
            return Response(results)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
