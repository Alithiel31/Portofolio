import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Express 4 n'attrape pas les rejets de promesse : un `throw` dans un handler `async` échappe au
 * gestionnaire d'erreurs global et finit en unhandled rejection. Ce wrapper rebranche le rejet
 * sur `next()`, ce qui rend enfin le handler d'erreurs de `index.ts` atteignable.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
