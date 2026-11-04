import { CERTIFICATIONS, certKey } from '../data/certifications';
import { certificationsApi } from '../services/api';
import useBackend from './useBackend';

/**
 * Static certifications first; the backend may add extra ones. Anything
 * whose title matches a bundled entry is ignored, so bundled data (which
 * has the correct issuer/dates) always wins.
 */
export default function useCertifications() {
  return useBackend(() => certificationsApi.getAll(), {
    fallback: CERTIFICATIONS,
    select: (res) => res.certifications,
    merge: (base, live) => {
      const seen = new Set(base.map((c) => certKey(c.title)));
      const extras = live
        .filter((c) => !seen.has(certKey(c.title)))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return [...base, ...extras];
    },
  });
}
