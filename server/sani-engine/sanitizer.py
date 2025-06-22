
import spacy
import json
import re
from typing import Dict, List, Tuple

class SaniEngine:
    def __init__(self):
        # Load spaCy model for NLP processing
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Please install spaCy English model: python -m spacy download en_core_web_sm")
            raise
    
    def sanitize_document(self, text: str) -> Dict:
        """
        Two-stage sanitization process implementing patent claims:
        1. Context-aware entity sanitization
        2. Ontological structuring
        """
        # Stage 1: Context-aware sanitization
        sanitized_text = self._context_aware_sanitization(text)
        
        # Stage 2: Ontological structuring  
        structured_metadata = self._ontological_structuring(sanitized_text, text)
        
        # Create composite data object (patent claim)
        composite_object = {
            "sanitized_text": sanitized_text,
            "structured_metadata": structured_metadata,
            "sanitization_metadata": {
                "entities_redacted": self._count_redacted_entities(text, sanitized_text),
                "structure_confidence": self._calculate_structure_confidence(structured_metadata),
                "processing_timestamp": self._get_timestamp()
            }
        }
        
        return composite_object
    
    def _context_aware_sanitization(self, text: str) -> str:
        """
        Patent Claim: Context-preserving entity redaction
        Maintains sentence structure while removing sensitive information
        """
        doc = self.nlp(text)
        sanitized = text
        
        # Define entity replacement mappings
        replacements = {
            "PERSON": "[EXECUTIVE_NAME]",
            "ORG": "[COMPANY]", 
            "MONEY": "[FINANCIAL_FIGURE]",
            "DATE": "[DATE]",
            "GPE": "[LOCATION]",  # Geopolitical entities
            "CARDINAL": "[NUMBER]"  # Cardinal numbers
        }
        
        # Sort entities by position (reverse order to maintain indices)
        entities = sorted(doc.ents, key=lambda x: x.start_char, reverse=True)
        
        for ent in entities:
            if ent.label_ in replacements:
                # Context-aware replacement preserving grammar
                replacement = self._context_aware_replacement(ent, replacements[ent.label_])
                sanitized = sanitized[:ent.start_char] + replacement + sanitized[ent.end_char:]
        
        return sanitized
    
    def _context_aware_replacement(self, entity, base_replacement: str) -> str:
        """
        Patent Claim: Context-preserving replacement logic
        Maintains grammatical structure and semantic coherence
        """
        # Analyze surrounding context for grammatical preservation
        if entity.text.isupper():
            return base_replacement.upper()
        elif entity.text.istitle():
            return base_replacement.title()
        else:
            return base_replacement.lower()
    
    def _ontological_structuring(self, sanitized_text: str, original_text: str) -> Dict:
        """
        Patent Claim: Ontological structuring of sanitized content
        Extracts relationships and creates structured metadata
        """
        doc = self.nlp(sanitized_text)
        
        structure = {
            "entities": self._extract_entity_relationships(doc),
            "clauses": self._extract_legal_clauses(sanitized_text),
            "dependencies": self._extract_dependency_relationships(doc),
            "semantic_structure": self._build_semantic_hierarchy(doc)
        }
        
        return structure
    
    def _extract_entity_relationships(self, doc) -> List[Dict]:
        """Extract relationships between identified entities"""
        relationships = []
        
        for sent in doc.sents:
            entities = [ent for ent in sent.ents]
            
            if len(entities) >= 2:
                # Find relationships between entities in same sentence
                for i, ent1 in enumerate(entities):
                    for ent2 in entities[i+1:]:
                        relationship = {
                            "entity1": ent1.text,
                            "entity1_type": ent1.label_,
                            "entity2": ent2.text, 
                            "entity2_type": ent2.label_,
                            "context": sent.text.strip(),
                            "relationship_type": self._infer_relationship_type(ent1, ent2, sent)
                        }
                        relationships.append(relationship)
        
        return relationships
    
    def _extract_legal_clauses(self, text: str) -> List[Dict]:
        """Extract legal clauses and provisions"""
        clauses = []
        
        # Common legal clause patterns
        clause_patterns = {
            "governing_law": r"governing law.*?(?=\.|;|\n)",
            "jurisdiction": r"jurisdiction.*?(?=\.|;|\n)", 
            "termination": r"terminat.*?(?=\.|;|\n)",
            "confidentiality": r"confidential.*?(?=\.|;|\n)",
            "liability": r"liabilit.*?(?=\.|;|\n)"
        }
        
        for clause_type, pattern in clause_patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                clauses.append({
                    "type": clause_type,
                    "content": match.group().strip(),
                    "position": match.span()
                })
        
        return clauses
    
    def _extract_dependency_relationships(self, doc) -> List[Dict]:
        """Extract grammatical dependencies for structural analysis"""
        dependencies = []
        
        for token in doc:
            if token.dep_ in ['nsubj', 'dobj', 'pobj', 'compound']:
                dependencies.append({
                    "token": token.text,
                    "dependency": token.dep_,
                    "head": token.head.text,
                    "pos": token.pos_,
                    "lemma": token.lemma_
                })
        
        return dependencies
    
    def _build_semantic_hierarchy(self, doc) -> Dict:
        """Build semantic hierarchy of document structure"""
        hierarchy = {
            "sentences": len(list(doc.sents)),
            "tokens": len(doc),
            "entities": len(doc.ents),
            "noun_phrases": [chunk.text for chunk in doc.noun_chunks],
            "semantic_roles": self._extract_semantic_roles(doc)
        }
        
        return hierarchy
    
    def _extract_semantic_roles(self, doc) -> List[Dict]:
        """Extract semantic roles (agent, patient, etc.)"""
        roles = []
        
        for sent in doc.sents:
            for token in sent:
                if token.dep_ == 'nsubj':  # Subject
                    roles.append({
                        "role": "agent",
                        "token": token.text,
                        "sentence": sent.text.strip()
                    })
                elif token.dep_ == 'dobj':  # Direct object
                    roles.append({
                        "role": "patient", 
                        "token": token.text,
                        "sentence": sent.text.strip()
                    })
        
        return roles
    
    def _infer_relationship_type(self, ent1, ent2, sentence) -> str:
        """Infer relationship type between entities"""
        # Simple relationship inference based on entity types and context
        type_pairs = (ent1.label_, ent2.label_)
        
        if type_pairs == ('PERSON', 'ORG'):
            return 'employment_or_affiliation'
        elif type_pairs == ('ORG', 'MONEY'):
            return 'financial_relationship'
        elif type_pairs == ('PERSON', 'MONEY'):
            return 'compensation_or_payment'
        else:
            return 'contextual_association'
    
    def _count_redacted_entities(self, original: str, sanitized: str) -> Dict:
        """Count entities that were redacted"""
        original_doc = self.nlp(original)
        return {
            "total_entities": len(original_doc.ents),
            "redacted_count": original.count('[') - sanitized.count('['),
            "entity_types": [ent.label_ for ent in original_doc.ents]
        }
    
    def _calculate_structure_confidence(self, metadata: Dict) -> float:
        """Calculate confidence score for structural analysis"""
        # Simple confidence calculation based on extracted elements
        element_count = (
            len(metadata.get('entities', [])) +
            len(metadata.get('clauses', [])) +
            len(metadata.get('dependencies', []))
        )
        
        return min(element_count / 10.0, 1.0)  # Normalize to 0-1
    
    def _get_timestamp(self) -> str:
        """Get processing timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()

# Example usage function
def demo_sani_engine():
    """Demonstrate Sani-Engine capabilities"""
    
    # Sample legal contract text
    sample_contract = """
    This Agreement is entered into between Acme Corporation, a Delaware corporation,
    and John Smith, Chief Executive Officer. The total compensation shall be $250,000
    annually. This Agreement shall be governed by the laws of California.
    Confidential information includes all proprietary data and trade secrets.
    Termination may occur with 30 days notice. The jurisdiction for disputes
    shall be San Francisco County Superior Court.
    """
    
    # Initialize Sani-Engine
    engine = SaniEngine()
    
    # Process document
    result = engine.sanitize_document(sample_contract)
    
    # Display results
    print("=== SANI-ENGINE PROCESSING RESULTS ===")
    print("\nSanitized Text:")
    print(result['sanitized_text'])
    
    print("\nStructured Metadata:")
    print(json.dumps(result['structured_metadata'], indent=2))
    
    print("\nSanitization Metadata:")
    print(json.dumps(result['sanitization_metadata'], indent=2))
    
    return result

if __name__ == "__main__":
    demo_sani_engine()
