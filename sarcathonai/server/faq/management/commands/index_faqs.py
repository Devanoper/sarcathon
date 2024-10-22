from django.core.management.base import BaseCommand
from faq.models import FAQ
from faq.utils import create_faq_index, index_faq

class Command(BaseCommand):
    help = 'Index all FAQs in Elasticsearch'

    def handle(self, *args, **kwargs):
        # Create the index if it doesn't exist
        if not create_faq_index():
            self.stdout.write(self.style.ERROR('Failed to create index'))
            return

        # Index all FAQs
        faqs = FAQ.objects.all()
        for faq in faqs:
            faq_dict = {
                'question': faq.question,
                'answer': faq.answer
            }
            if index_faq(faq_dict):
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully indexed FAQ: {faq.question[:50]}...')
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'Failed to index FAQ: {faq.question[:50]}...')
                )