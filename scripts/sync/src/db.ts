import { PrismaClient } from '../prisma/generated';
import { createEnsureRecord } from './lib/ensure';

export let db = new PrismaClient();

export let ensureVendor = createEnsureRecord(db.publicServerVendor, d => ({
  identifier: d.identifier
}));

export let ensureRepo = createEnsureRecord(db.publicRepository, d => ({
  identifier: d.identifier
}));

export let ensureServer = createEnsureRecord(db.publicServer, d => ({
  identifier: d.identifier
}));

export let ensureProvider = createEnsureRecord(db.publicServerProvider, d => ({
  identifier: d.identifier
}));

export let ensureServerVariant = createEnsureRecord(db.publicServerVariant, d => ({
  identifier: d.identifier
}));

export let ensureServerCategory = createEnsureRecord(db.publicServerCategory, d => ({
  identifier: d.identifier
}));

export let ensureServerVersion = createEnsureRecord(db.publicServerVariantVersion, d => ({
  variantIdentifier_identifier: {
    variantIdentifier: d.variantIdentifier!,
    identifier: d.identifier
  }
}));
