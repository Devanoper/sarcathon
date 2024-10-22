from elasticsearch import Elasticsearch
from transformers import BertTokenizer, BertModel
import torch
from typing import List, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Elasticsearch configuration
CLOUD_ID = 'f05504d71e7c4a308c6393fae548f768:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ0ZDY5YjdhOTE4YzE0NmYwYWQ3NTAzMTEyYjZiZTNkMCQ1MzZiNjQ1Mzc1YzQ0ZWYxYjU3NzY3NjAwNTI0YWUzYg=='
USERNAME = 'elastic'
PASSWORD = 'eDh1RQbA3i6dMv2cEYNNcy2J'

# Initialize Elasticsearch client
es = Elasticsearch(
    cloud_id=CLOUD_ID,
    basic_auth=(USERNAME, PASSWORD)
)

# Initialize BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

def get_embedding(text: str) -> List[float]:
    """Generate BERT embedding for a given text."""
    try:
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Use [CLS] token embedding as the sentence embedding
        embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()[0].tolist()
        return embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        raise

def create_faq_index():
    """Create the FAQ index with proper mappings."""
    index_name = "faq_index"
    
    # Define the mapping for the FAQ index
    mapping = {
        "mappings": {
            "properties": {
                "question": {
                    "type": "text",
                    "analyzer": "standard"
                },
                "answer": {
                    "type": "text",
                    "analyzer": "standard"
                },
                "question_embedding": {
                    "type": "dense_vector",
                    "dims": 768  # BERT base hidden size
                }
            }
        },
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 1
        }
    }
    
    try:
        if not es.indices.exists(index=index_name):
            es.indices.create(index=index_name, body=mapping)
            logger.info(f"Created index: {index_name}")
        return True
    except Exception as e:
        logger.error(f"Error creating index: {str(e)}")
        return False

def index_faq(faq: Dict[str, Any]):
    """Index a single FAQ document with its embedding."""
    try:
        # Generate embedding for the question
        question_embedding = get_embedding(faq['question'])
        
        # Prepare the document
        doc = {
            'question': faq['question'],
            'answer': faq['answer'],
            'question_embedding': question_embedding
        }
        
        # Index the document
        result = es.index(index='faq_index', document=doc)
        logger.info(f"Indexed FAQ: {result['_id']}")
        return True
    except Exception as e:
        logger.error(f"Error indexing FAQ: {str(e)}")
        return False

def search_faqs(query: str, size: int = 3) -> List[Dict[str, Any]]:
    """
    Search FAQs using a combination of text search and embedding similarity.
    """
    try:
        # Generate embedding for the query
        query_embedding = get_embedding(query)
        
        # Build the search query
        search_query = {
            "size": size,
            "query": {
                "function_score": {
                    "query": {
                        "match": {
                            "question": {
                                "query": query,
                                "boost": 1.0
                            }
                        }
                    },
                    "functions": [
                        {
                            "script_score": {
                                "script": {
                                    "source": "cosineSimilarity(params.query_vector, 'question_embedding') + 1.0",
                                    "params": {
                                        "query_vector": query_embedding
                                    }
                                }
                            }
                        }
                    ],
                    "boost_mode": "multiply"
                }
            }
        }
        
        # Execute the search
        results = es.search(
            index="faq_index",
            body=search_query
        )
        
        # Format results
        formatted_results = []
        for hit in results['hits']['hits']:
            formatted_results.append({
                'question': hit['_source']['question'],
                'answer': hit['_source']['answer'],
                'score': hit['_score']
            })
            
        return formatted_results
    except Exception as e:
        logger.error(f"Error searching FAQs: {str(e)}")
        raise